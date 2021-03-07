import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useFirestore, useFirestoreConnect } from 'react-redux-firebase';
import { IOrder } from 'types/checkout';
import { IState } from '../state/reducers';

interface IUseCheckout {
  orders: IOrder[];
  initOrder: (order: IOrder) => Promise<string>;
}

export function useCheckout(): IUseCheckout {
  const firestore = useFirestore();
  const [error, setError] = useState(undefined as Error | undefined);

  useFirestoreConnect(['orders']);

  const orders: IOrder[] = useSelector(
    ({ firestore: { data } }: IState) => data.orders,
  );

  const initOrder = async (order: IOrder) => {
    // Send the order request to Firebase as a token: orderId
    // which can be verified server side with getServerSideProps
    // on the /checkout page.

    // Since we have useFirestoreConnect,
    // order is automatically synced with firebase.

    try {
      const { id: orderId } = await firestore.collection('orders').add(order);

      console.log('useCheckout ➡️ orderId:', orderId);

      // Submit user clicked buy now to segment
      window.analytics.track('User clicked Buy Now from Article Page', {
        ...order,
        orderId,
      });

      return orderId;
    } catch (e) {
      setError(new Error(`setUserData Error: ${e}`));

      return null;
    }
  };

  return { orders, initOrder };
}
