import { Button } from '@tastiest-io/tastiest-components';
import React, { useContext, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ScreenContext } from '../../contexts/screen';
import { useAuth } from '../../hooks/useAuth';
import { InputEmail } from '../inputs/InputEmail';
import { InputPassword } from '../inputs/InputPassword';

export function CheckoutSignIn() {
  const { signIn, signUp, resetPassword, isSignedIn, error } = useAuth();
  const { isMobile } = useContext(ScreenContext);
  const dispatch = useDispatch();

  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const cleanupInputValue = (value: string | number) =>
    String(value).toLowerCase().trim();

  // TODO -> Abstract this away so it's not just copying SignInModal

  return (
    <>
      <InputEmail
        value={signInEmail}
        onValueChange={value => setSignInEmail(cleanupInputValue(value))}
      />
      <InputPassword
        value={signInPassword}
        onValueChange={value => setSignInPassword(cleanupInputValue(value))}
      />
      <Button
        wide
        size="large"
        type="solid"
        color="primary"
        className="py-3 rounded-xl"
        onClick={() => signIn(signInEmail, signInPassword)}
      >
        Sign In
      </Button>
      {error && (
        <div className="mb-1 -mt-1 text-sm text-center text-red-700">
          {error}
        </div>
      )}
    </>
  );
}
