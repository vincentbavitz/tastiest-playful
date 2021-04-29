import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
} from '@stripe/react-stripe-js';
import {
  StripeCardExpiryElementChangeEvent,
  StripeCardNumberElementOptions,
} from '@stripe/stripe-js';
import { Tooltip } from '@tastiest-io/tastiest-components';
import { HelpIcon } from '@tastiest-io/tastiest-icons';
import {
  dlog,
  IDateObject,
  IOrder,
  UserData,
} from '@tastiest-io/tastiest-utils';
import clsx from 'clsx';
import { InputContactBirthday } from 'components/inputs/contact/InputContactBirthday';
import { InputMobile } from 'components/inputs/contact/InputMobile';
import { InputName } from 'components/inputs/contact/InputName';
import InputPostcode from 'components/inputs/contact/InputPostcode';
import { useCheckout } from 'hooks/checkout/useCheckout';
import { useOrder } from 'hooks/checkout/useOrder';
import { useAuth } from 'hooks/useAuth';
import { useScreenSize } from 'hooks/useScreenSize';
import { useUserData } from 'hooks/useUserData';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import {
  CheckoutStep,
  setCheckoutStep,
  setIsPaymentProcessing,
} from 'state/checkout';
import { IState } from 'state/reducers';
import { UI } from '../../../constants';
import { InputCardNumberWrapper } from '../../inputs/card/InputCardNumberWrapper';
import { InputWrapper } from '../../inputs/InputWrapper';
import { CheckoutPaymentPanel } from '../CheckoutPaymentPanel';
import { CheckoutTabs } from '../CheckoutTabs';

const CARD_ELEMENT_OPTIONS: StripeCardNumberElementOptions = {
  classes: {
    base: 'py-2 w-full',
  },
};

interface Props {
  userId: string;
  order: IOrder;
}

type FormData = {
  firstName: string;
  lastName: string;
  mobile: string;
  cardPostcode: string;
  cardHolderName: string;
};

export function CheckoutStepPayment(props: Props) {
  const { order: initialOrder, userId } = props;

  const { user, isSignedIn } = useAuth();
  const { userData, setUserData } = useUserData(user);
  const dispatch = useDispatch();

  const { isPaymentProcessing } = useSelector(
    (state: IState) => state.checkout,
  );

  const { isMobile, isTablet, isDesktop } = useScreenSize();

  // Contact
  const [birthday, setBirthday] = useState<IDateObject>(
    userData?.details?.birthday ?? null,
  );

  // Checkout and order hooks
  const { cardBrand, addCard, onCardNumberChange } = useCheckout();
  const { order, pay, updateOrder } = useOrder(
    initialOrder?.token,
    initialOrder,
  );

  useEffect(() => {
    dlog('CheckoutStepPayment ➡️ isPaymentProcessing:', isPaymentProcessing);
  }, [isPaymentProcessing]);

  // Redirect if user is logged out
  useEffect(() => {
    if (isSignedIn === false) {
      dispatch(setCheckoutStep(CheckoutStep.SIGN_IN));
      return null;
    }
  }, [isSignedIn]);

  const onCardExpiryChange = (event: StripeCardExpiryElementChangeEvent) => {
    event;
  };

  const makePayment = async ({
    firstName,
    lastName,
    mobile,
    cardPostcode,
    cardHolderName,
  }: FormData) => {
    // Validate birthday (input itself already does user facing error message)
    if (
      birthday.day.length !== 2 ||
      birthday.month.length !== 2 ||
      birthday.year.length !== 4
    ) {
      return;
    }

    // Start isLoading
    dispatch(setIsPaymentProcessing(true));

    // Set new user data
    setUserData(UserData.DETAILS, {
      firstName,
      lastName,
      mobile,
      postalCode: cardPostcode,
    });

    const { paymentMethod, error: paymentMethodError } = await addCard(
      cardHolderName,
      cardPostcode,
    );

    if (paymentMethodError) {
      dlog('CheckoutStepPayment ➡️ paymentMethodError:', paymentMethodError);
      dispatch(setIsPaymentProcessing(false));
      return { success: false, error: paymentMethodError };
    }

    const { error: updateOrderError } = await updateOrder({
      paymentMethodId: paymentMethod.id,
    });

    if (updateOrderError) {
      dlog('CheckoutStepPayment ➡️ updateOrderError:', updateOrderError);
      dispatch(setIsPaymentProcessing(false));
      return { success: false, error: updateOrderError };
    }

    // Set name if it doesn't exist already
    await setUserData(UserData.DETAILS, {
      firstName,
      lastName,
    });

    const { success, error } = await pay();
    dispatch(setIsPaymentProcessing(false));
  };

  useEffect(() => {
    dlog('CheckoutStepPayment ➡️ order:', order);
  }, [order]);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    criteriaMode: 'firstError',
    shouldFocusError: true,
  });

  dlog('CheckoutStepPayment ➡️ errors:', errors);

  return (
    <div className="flex flex-col-reverse w-full pb-24 tablet:pb-0 tablet:flex-row tablet:justify-between">
      <div
        style={{
          minWidth:
            isMobile || isTablet ? 'unset' : `${UI.CHECKOUT_SPLIT_WIDTH_PX}px`,
        }}
        className="flex flex-col w-full pb-20 space-y-16 tablet:pb-0 tablet:w-7/12"
      >
        <div>
          {isDesktop ? (
            <CheckoutTabs tabs={[{ label: 'Contact Details' }]} />
          ) : (
            <div className="pt-4 mb-4 text-lg font-medium text-gray-600 border-b border-gray-400">
              Contact details
            </div>
          )}

          <div className="flex flex-col space-y-4">
            <InputName
              name="firstName"
              size="large"
              label="First Name"
              defaultValue={userData?.details?.firstName}
              control={control}
              disabled={isPaymentProcessing}
            />

            <InputName
              name="lastName"
              size="large"
              label="Last Name"
              defaultValue={userData?.details?.lastName}
              control={control}
              disabled={isPaymentProcessing}
            />

            <InputContactBirthday
              date={birthday}
              disabled={isPaymentProcessing}
              onDateChange={value => setBirthday(value)}
            />

            <InputMobile
              name="mobile"
              size="large"
              control={control}
              disabled={isPaymentProcessing}
            />
          </div>
        </div>

        <div>
          {isDesktop ? (
            <CheckoutTabs tabs={[{ label: 'Payment' }]} />
          ) : (
            <div className="pt-4 mb-4 text-lg font-medium text-gray-600 border-b border-gray-400">
              Payment details
            </div>
          )}

          <div className="flex flex-col space-y-4">
            <InputName
              size="large"
              name="cardHolderName"
              label="Cardholder's Full Name"
              requiredText="Please enter the cardholder's name"
              control={control}
              disabled={isPaymentProcessing}
            />

            <InputCardNumberWrapper
              brand={cardBrand}
              disabled={isPaymentProcessing}
            >
              <CardNumberElement
                onChange={onCardNumberChange}
                options={CARD_ELEMENT_OPTIONS}
              />
            </InputCardNumberWrapper>

            <div className="flex w-full space-x-3">
              <InputWrapper
                size="large"
                label="Expiration Date"
                className="py-1"
                disabled={isPaymentProcessing}
              >
                <CardExpiryElement
                  onChange={onCardExpiryChange}
                  options={CARD_ELEMENT_OPTIONS}
                />
              </InputWrapper>

              <InputWrapper
                size="large"
                label="Security Code"
                className="py-1"
                disabled={isPaymentProcessing}
                externalSuffix={
                  <Tooltip content="This is the 3 digit code on the back of your card.">
                    <HelpIcon className="h-6" />
                  </Tooltip>
                }
              >
                <CardCvcElement options={CARD_ELEMENT_OPTIONS} />
              </InputWrapper>
            </div>

            <InputPostcode
              size="large"
              label="Postcode"
              name="cardPostcode"
              placeholder="WC2H 7LT"
              control={control}
              disabled={isPaymentProcessing}
            />
          </div>
        </div>
      </div>

      <div
        className={clsx(
          'w-full tablet:flex-grow tablet:w-5/12',
          isDesktop && 'pl-10',
        )}
      >
        <CheckoutPaymentPanel
          order={order}
          submit={handleSubmit(makePayment)}
        />
      </div>
    </div>
  );
}
