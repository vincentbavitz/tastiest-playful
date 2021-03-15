import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import {
  StripeCardExpiryElementChangeEvent,
  StripeCardNumberElementChangeEvent,
  StripeCardNumberElementOptions,
} from '@stripe/stripe-js';
import HelpSVG from '@svg/checkout/help.svg';
import { InputContactBirthday } from 'components/inputs/contact/InputContactBirthday';
import { useAuth } from 'hooks/useAuth';
import { useCheckout } from 'hooks/useCheckout';
import { useUserData } from 'hooks/useUserData';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useFirestore } from 'react-redux-firebase';
import { IDateObject } from 'types/various';
import { CardBrand, IOrder } from '../../../types/checkout';
import { InputCardNumberWrapper } from '../../inputs/card/InputCardNumberWrapper';
import { InputContactFirstName } from '../../inputs/contact/InputContactFirstName';
import { InputContactLastName } from '../../inputs/contact/InputContactLastName';
import { InputAbstract } from '../../inputs/InputAbstract';
import { InputWrapper } from '../../inputs/InputWrapper';
import { Tooltip } from '../../Tooltip';
import { CheckoutOrderSummaryPayment } from '../CheckoutOrderSummaryPayment';
import { CheckoutTabs } from '../CheckoutTabs';

const CARD_ELEMENT_OPTIONS: StripeCardNumberElementOptions = {
  classes: {
    base: 'py-2 w-full',
  },
};

interface Props {
  order: IOrder;
  stripeClientSecret: string;
}

export function CheckoutStepPayment(props: Props) {
  const { order, stripeClientSecret } = props;
  const { userId } = order;

  const { user } = useAuth();
  const { pay, updateOrder } = useCheckout();
  const { setUserData } = useUserData(user);

  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const firestore = useFirestore();

  // Contact
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthday, setBirthday] = useState<IDateObject>();

  // Payment
  const [cardholderName, setCardholderName] = useState('');
  const [cardPostcode, setCardPostcode] = useState('');
  const [cardBrand, setCardBrand] = useState<CardBrand | undefined>(undefined);
  const [paymentError, setPaymentError] = useState<string>(null);

  const handleSubmit = async () => {
    // Ensure all inputs are valid
    if (
      firstName.length < 2 ||
      lastName.length < 2 ||
      !birthday.day ||
      !birthday.month ||
      !birthday.year
    ) {
      alert('Please fill out contact details');
    }

    const { success, error } = await pay(stripeClientSecret);

    if (success) {
      // Segment: Payment success event
      router.push('/thank-you');

      return;
    }

    if (error) {
      // Segment: Payment failure event
    }

    console.log('CheckoutOrderSummary ➡️ error:', error);
  };

  // IF PAYMENT / CONTACT DETAILS ARE VALID, UPDATE THEIR USER FILES
  // IF PAYMENT / CONTACT DETAILS ARE VALID, UPDATE THEIR USER FILES
  // IF PAYMENT / CONTACT DETAILS ARE VALID, UPDATE THEIR USER FILES

  // Now that we're logged in, update the user ID on the Firebase order
  useEffect(() => {
    updateOrder(order.id, { userId });
  }, []);

  const onCardNumberChange = (event: StripeCardNumberElementChangeEvent) => {
    // prettier-ignore
    const brand = 
      event.brand === 'visa' ? CardBrand.VISA :
      event.brand === 'mastercard' ? CardBrand.MASTERCARD :
      undefined;

    console.log('CheckoutStepPayment ➡️ brand:', brand);

    setCardBrand(brand);
  };

  const onCardExpiryChange = (event: StripeCardExpiryElementChangeEvent) => {
    event;
  };

  return (
    <div className="flex flex-col pb-24 space-y-16">
      <div className="">
        <CheckoutTabs tabs={[{ label: 'Contact Details' }]} />

        <div className="flex flex-col space-y-4">
          <InputContactFirstName
            value={firstName}
            onValueChange={value => setFirstName(value)}
          />

          <InputContactLastName value={lastName} onValueChange={setLastName} />

          <InputContactBirthday
            date={birthday}
            onDateChange={value => setBirthday(value)}
          />
        </div>
      </div>

      <div>
        <CheckoutTabs tabs={[{ label: 'Payment' }]} />

        <div className="flex flex-col space-y-4">
          <InputAbstract
            type="text"
            className="py-1 rounded-xl"
            label="Cardholder's Full Name"
            regex={/^([a-zA-z]{0,15}[ ]?){1,4}$/}
            value={cardholderName}
            onValueChange={setCardholderName}
          />

          <InputCardNumberWrapper brand={cardBrand}>
            <CardNumberElement
              onChange={onCardNumberChange}
              options={CARD_ELEMENT_OPTIONS}
            />
          </InputCardNumberWrapper>

          <div className="flex w-full space-x-3">
            <InputWrapper size="large" label="Expiration Date" className="py-1">
              <CardExpiryElement
                onChange={onCardExpiryChange}
                options={CARD_ELEMENT_OPTIONS}
              />
            </InputWrapper>

            <InputWrapper
              size="large"
              label="Security Code"
              className="py-1"
              externalSuffix={
                <Tooltip content="This is the 3 digit code on the back of your card.">
                  <HelpSVG className="h-6" />
                </Tooltip>
              }
            >
              <CardCvcElement options={CARD_ELEMENT_OPTIONS} />
            </InputWrapper>
          </div>

          <InputAbstract
            label="Postcode"
            className="py-1 rounded-xl"
            regex={/^([a-zA-Z0-8]){1,10}$/}
            value={cardPostcode}
            onValueChange={setCardPostcode}
          />
        </div>

        <CheckoutOrderSummaryPayment order={order} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
