import {
  CmsApi,
  dlog,
  FIREBASE,
  FirestoreCollection,
  FunctionsResponse,
  IOrder,
  IOrderRequest,
  IPromo,
} from '@tastiest-io/tastiest-utils';
import * as Analytics from 'analytics-node';
import { NextApiRequest, NextApiResponse } from 'next';
import { firebaseAdmin } from 'utils/firebaseAdmin';
import { v4 as uuid } from 'uuid';

export type CreateNewOrderReturn = FunctionsResponse<{
  orderId: string;
}>;

/**
 * Requires the query parameters...
 *  ```dealId: string;
 *  heads: number;
 *  fromSlug: string;
 *  promoCode: string | undefined
 *  userId: string | undefined```
 *
 * Response is of the shape `{ orderId: string | null, error: Error | string | null }`
 */
export default async function createNewOrder(
  request: NextApiRequest,
  response: NextApiResponse<CreateNewOrderReturn>,
) {
  // Only allow POST
  if (request.method !== 'POST') {
    response.status(405).end();
    return;
  }

  // Get body in JSON or raw.
  let body;
  try {
    body = JSON.parse(request.body);
  } catch {
    body = request.body;
  }

  const { dealId, heads: _heads, fromSlug, promoCode, userId } = body;
  const heads = Math.floor(_heads);

  const orderRequest: IOrderRequest = {
    dealId,
    heads,
    fromSlug,
    promoCode,
    userId,
    timestamp: Date.now(),
  };

  const { success, error } = await validateOrderRequest(orderRequest);

  if (!success) {
    response.json({
      success: false,
      data: { orderId: null },
      error,
    });
    return;
  }

  const order = await buildOrder(orderRequest);

  // Create new order in Firebase
  await firebaseAdmin
    .firestore()
    .collection(FirestoreCollection.ORDERS)
    .doc(order.id)
    .set(order);

  // Track with Segment
  const analytics = new Analytics(process.env.NEXT_PUBLIC_ANALYTICS_WRITE_KEY);
  analytics.track({
    userId: userId ?? null,
    event: 'New unpaid order created',
    properties: {
      traits: {
        orderId: order.id,
        ...orderRequest,
      },
    },
  });

  response.json({
    success: true,
    data: { orderId: order.id },
    error: null,
  });
}

/**
 * Ensure all the types and values from Firebase are valid in the order request
 */
const validateOrderRequest = async (orderRequest: IOrderRequest) => {
  // Expired order request
  if (
    Date.now() >
    orderRequest?.timestamp + FIREBASE.ORDER_REQUEST_MAX_AGE_MS
  ) {
    return {
      success: false,
      error: 'validateOrderRequest: Order request has expired',
    };
  }

  // Valid number of heads?
  if (
    orderRequest?.heads < 1 ||
    orderRequest.heads > FIREBASE.ORDER_REQUEST_MAX_HEADS
  ) {
    return {
      success: false,
      error: 'validateOrderRequest: Invalid number of heads',
    };
  }

  // Get deal and restaurant from Contentful
  // If deal does not exist on Contentful, there was a clientside mismatch.
  // This could be an innocent error, or the user is sending nefarious requests.
  const cms = new CmsApi();
  const deal = await cms.getDeal(orderRequest.dealId ?? '');

  if (!deal) {
    return { success: false, error: 'Deal does not exist with this ID' };
  }

  // Validate promotion code
  orderRequest.promoCode;

  // Validate user ID (required?)
  null;

  // Passed all tests 🎉
  return { success: true, error: null };
};

const buildOrder = async (orderRequest: IOrderRequest) => {
  // Get deal
  const cms = new CmsApi();
  const deal = await cms.getDeal(orderRequest.dealId ?? '');

  // Validate deal and slug, validate that deal is still available
  //

  // Validate number of heads
  const heads = Math.floor(orderRequest.heads);

  // Is userId valid and is user online?
  // Is promoCode valid? If so, calculate IPromo and final price
  const promo: IPromo = await cms.getPromo(orderRequest.promoCode);
  const promoIsValid = true;
  if (promo.validTo < Date.now()) {
    // Out of date
  }

  // Gross price
  const gross = deal.pricePerHeadGBP * heads;

  const orderId = uuid();
  const order: IOrder = {
    id: orderId,
    deal,
    userId: null,
    heads: orderRequest.heads,
    fromSlug: orderRequest.fromSlug,
    price: {
      gross,
      final: calculatePromoPrice(gross, promo),
    },
    paymentDetails: null,
    promoCode: promo.code,

    // Timestamps
    // Null denotes not paid yet; not done yet.
    paidAt: null,
    orderedAt: null,
    abandonedAt: null,
    refund: null,
  };

  return order;
};

/**
 * Calculate price after applying promocode.
 */
const calculatePromoPrice = (price: number, promo: IPromo): number => {
  const isPercentage = promo?.discount?.unit === '%';

  if (isPercentage) {
    const discountGbp = price * (1 - Math.min(promo.discount.value, 100) / 100);
    dlog('createNewOrder ➡️ price:', price);
    dlog('createNewOrder ➡️ discountGbp:', discountGbp);
    return price - discountGbp;
  }

  return Math.max(0, price - promo?.discount?.value ?? 0);
};
