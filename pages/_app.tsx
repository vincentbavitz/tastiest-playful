import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore'; // <- needed if using firestore
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';
import { createStore } from 'redux';
import { createFirestoreInstance } from 'redux-firestore';
import '../assets/style.scss';
import Layout from '../components/layout';
import { FIREBASE, METADATA } from '../constants';
import { AuthProvider } from '../contexts/auth';
import ScreenProvider from '../contexts/screen';
import { useAuth } from '../hooks/useAuth';
import { useLocationChange } from '../hooks/useLocationChange';
import { useTracking } from '../hooks/useTracking';
import { openSignInModal } from '../state/navigation';
import { rootReducer } from '../state/reducers';

if (!firebase.apps.length) {
  // Initialize firebase instance
  firebase.initializeApp(FIREBASE.CLIENT_CONFIG);

  // Initialize other services on firebase instance
  firebase.firestore();
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
}

const store = createStore(rootReducer);

const rrfProps = {
  firebase,
  config: FIREBASE.RRF_CONFIG,
  dispatch: store.dispatch,
  createFirestoreInstance,
};

function App({ Component, pageProps }: AppProps) {
  const { user, isSignedIn } = useAuth();
  const router = useRouter();

  const handleLocationChange = () => {
    // Open login modal from URL params
    if (router.query?.login === '1' && !isSignedIn) {
      store.dispatch(openSignInModal());
    }
  };

  useTracking();
  useLocationChange(handleLocationChange);

  return (
    <StoreProvider store={store}>
      <ReactReduxFirebaseProvider {...rrfProps}>
        <AuthProvider>
          <ScreenProvider>
            <Head>
              <title>{METADATA.TITLE_SUFFIX}</title>
            </Head>

            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ScreenProvider>
        </AuthProvider>
      </ReactReduxFirebaseProvider>
    </StoreProvider>
  );
}

export default App;
