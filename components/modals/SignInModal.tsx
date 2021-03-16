import TastiestLogo from '@svg/brand.svg';
import EmailSVG from '@svg/email.svg';
import PasswordSVG from '@svg/lock.svg';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { METADATA } from '../../constants';
import { ScreenContext } from '../../contexts/screen';
import { useAuth } from '../../hooks/useAuth';
import { closeSignInModal, ModalInstance } from '../../state/navigation';
import { IState } from '../../state/reducers';
import { Button } from '../Button';
import { InputAbstract } from '../inputs/InputAbstract';
import { Modal } from '../Modal';
import { SignInTosInfo } from '../SignInTosInfo';

enum LoginFlowStep {
  CONTINUE = 'CONTINUE',
  SIGN_IN = 'SIGN_IN',
  SIGN_UP = 'SIGN_UP',
  RESET_PASSWORD = 'RESET_PASSWORD',
}

export function SignInModal() {
  const { signIn, signUp, resetPassword, isSignedIn, error } = useAuth();
  const { isSignInModalOpen } = useSelector(
    (state: IState) => state.navigation,
  );

  const isOpen = isSignInModalOpen && isSignedIn === false;
  const { isMobile } = useContext(ScreenContext);
  const dispatch = useDispatch();

  const router = useRouter();
  const [signInEmail, setSignInEmail] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [step, setStep] = useState<LoginFlowStep>(LoginFlowStep.SIGN_IN);

  const [resetPasswordSuccess, setResetPasswordSuccess] = useState(null);

  const handleLocationChange = () => {
    dispatch(closeSignInModal());
  };

  // Close modal on location change
  useEffect(() => {
    router.events.on('routeChangeComplete', handleLocationChange);
    return () => router.events.off('routeChangeComplete', handleLocationChange);
  }, []);

  // Close if the user is signed in
  useEffect(() => {
    if (isSignedIn) {
      dispatch(closeSignInModal());
    }
  }, []);

  // Reset password success message when moving between steps
  useEffect(() => {
    setResetPasswordSuccess(null);
  }, [step]);

  const onClickSignUp = async () => {
    const signUpSuccessful = await signUp('', signUpEmail, signUpPassword);

    if (signUpSuccessful) {
      dispatch(closeSignInModal());
    }
  };

  const onClickResetPassword = async () => {
    const resetPasswordSuccessful = await resetPassword(signInEmail);
    setResetPasswordSuccess(resetPasswordSuccessful);
  };

  const continueContent = (
    <Button
      wide
      size="large"
      type="outline"
      color="secondary"
      prefix={<EmailSVG className="w-8 h-6" />}
      suffix={<div className="w-6"></div>}
      onClick={() => setStep(LoginFlowStep.SIGN_IN)}
    >
      Continue with email
    </Button>
  );

  const cleanupInputValue = (value: string | number) =>
    String(value).toLowerCase().trim();

  const signInContent = (
    <>
      <InputAbstract
        size="large"
        type="email"
        className="py-2 rounded-xl"
        placeholder="Email address"
        prefix={<EmailSVG className="h-6" />}
        // suffix={<>!</>}
        value={signInEmail}
        maxLength={50}
        onValueChange={value => setSignInEmail(cleanupInputValue(value))}
      ></InputAbstract>

      <InputAbstract
        size="large"
        type="password"
        className="py-2 rounded-xl"
        placeholder="Password"
        prefix={<PasswordSVG className="h-8 ml-2 mr-2" />}
        value={signInPassword}
        onValueChange={value => setSignInPassword(cleanupInputValue(value))}
        maxLength={50}
      ></InputAbstract>

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

  const signUpContent = (
    <>
      <InputAbstract
        size="large"
        type="email"
        className="py-2 rounded-xl"
        placeholder="Email address"
        prefix={<EmailSVG className="h-6" />}
        value={signUpEmail}
        onValueChange={value => setSignUpEmail(cleanupInputValue(value))}
      ></InputAbstract>

      <InputAbstract
        size="large"
        type="password"
        className="py-2 rounded-xl"
        placeholder="Create a password"
        prefix={<PasswordSVG className="h-8 ml-2 mr-2" />}
        value={signUpPassword}
        onValueChange={value => setSignUpPassword(cleanupInputValue(value))}
      ></InputAbstract>

      <Button
        wide
        size="large"
        type="solid"
        color="primary"
        className="py-3 rounded-xl"
        onClick={onClickSignUp}
      >
        Join
      </Button>

      {error && (
        <div className="mb-1 -mt-1 text-sm text-center text-red-700">
          {error}
        </div>
      )}
    </>
  );

  const resetPasswordContent = (
    <>
      <InputAbstract
        size="large"
        type="email"
        className="py-2 rounded-xl"
        placeholder="Email address"
        prefix={<EmailSVG className="h-6" />}
        value={signInEmail}
        onValueChange={value => setSignInEmail(cleanupInputValue(value))}
      ></InputAbstract>

      <Button
        wide
        size="large"
        type="solid"
        color="primary"
        className="py-3 rounded-xl"
        onClick={onClickResetPassword}
      >
        Reset
      </Button>

      {error && (
        <div className="mb-1 -mt-1 text-sm text-center text-red-700">
          {error}
        </div>
      )}

      {!error && resetPasswordSuccess && (
        <div className="mb-1 -mt-1 text-sm text-center">
          We've sent you an email with instructions to reset your password.
        </div>
      )}
    </>
  );

  const signInSubtext = (
    <>
      <p>
        Forgot password?{' '}
        <a
          className="font-semibold cursor-pointer"
          onClick={() => setStep(LoginFlowStep.RESET_PASSWORD)}
        >
          Reset
        </a>
      </p>
      <p>
        Don't have an account?{' '}
        <a
          className="font-semibold cursor-pointer"
          onClick={() => setStep(LoginFlowStep.SIGN_UP)}
        >
          Sign Up
        </a>
      </p>
    </>
  );

  const signUpSubtext = (
    <>
      <p>
        Already have an account?{' '}
        <a
          className="font-semibold cursor-pointer"
          onClick={() => setStep(LoginFlowStep.SIGN_IN)}
        >
          Sign In
        </a>
      </p>
    </>
  );

  const resetPasswordSubtext = (
    <>
      <p>
        Found your account?{' '}
        <a
          className="font-semibold cursor-pointer"
          onClick={() => setStep(LoginFlowStep.SIGN_IN)}
        >
          Sign In
        </a>
      </p>
      <p>
        Otherwise, you can{' '}
        <a
          className="font-semibold cursor-pointer"
          onClick={() => setStep(LoginFlowStep.SIGN_UP)}
        >
          Sign Up{' '}
        </a>
        here.
      </p>
    </>
  );

  // prettier-ignore
  const title = 
    step === LoginFlowStep.CONTINUE ? 'Hello!' :
    step === LoginFlowStep.SIGN_IN ? 'Welcome Back!' :
    step === LoginFlowStep.SIGN_UP ? "Join Now! - It's free!" :
    step === LoginFlowStep.RESET_PASSWORD? 'Reset your password' :
    null;

  // prettier-ignore
  const subtitle = 
    step === LoginFlowStep.SIGN_IN ? 'Sign in to your account here.' :
    step === LoginFlowStep.SIGN_UP ? METADATA.TAGLINE :
    step === LoginFlowStep.RESET_PASSWORD ? 'Forgot your password? No worries.' :
    null;

  // prettier-ignore
  const content = 
    step === LoginFlowStep.CONTINUE ? continueContent :
    step === LoginFlowStep.SIGN_IN ? signInContent :
    step === LoginFlowStep.SIGN_UP ? signUpContent :
    step === LoginFlowStep.RESET_PASSWORD ? resetPasswordContent :
    null;

  // prettier-ignore
  const subtext = 
    step === LoginFlowStep.SIGN_IN ? signInSubtext :
    step === LoginFlowStep.SIGN_UP ? signUpSubtext :
    step === LoginFlowStep.RESET_PASSWORD ? resetPasswordSubtext :
    null;

  if (isSignedIn) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onMobileFullscreen
      modalId={ModalInstance.LOGIN}
      close={() => dispatch(closeSignInModal())}
    >
      <div
        style={{
          width: isMobile ? '100%' : '350px',
          height: isMobile ? '100%' : '510px',
          minHeight: '500px',
        }}
        className="relative flex flex-col justify-between"
      >
        <div className="flex flex-col items-center flex-grow space-y-5">
          <TastiestLogo className="h-8 fill-current" />
          <div className="w-full text-center">
            <h1 className="text-4xl font-somatic">{title}</h1>
            {subtitle && (
              <h3 className="-mt-1 font-roboto font-semiobld">{subtitle}</h3>
            )}
          </div>

          <div className="flex flex-col w-full pt-2 space-y-4">{content}</div>
          <div className="text-sm text-center">{subtext}</div>
        </div>

        <SignInTosInfo />
      </div>
    </Modal>
  );
}
