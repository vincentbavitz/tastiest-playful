import * as firebaseAdmin from 'firebase-admin';
import { GetServerSidePropsContext } from 'next';
import nookies from 'nookies';
import { TUserData, UserData } from 'types/firebase';
import { CERT } from '../constants/firebase';

if (!firebaseAdmin.apps.length) {
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(CERT),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

// Intended for server-side use ONLY!
export class UserDataApi {
  public userId: string | null;

  /*
   * Get context from getServerSideProps
   */
  constructor() {
    if (typeof window !== undefined) {
      return null;
    }

    this.userId = null;
  }

  public async init(ctx: GetServerSidePropsContext) {
    return this.verfiyUserAuth(ctx);
  }

  private async verfiyUserAuth(ctx: GetServerSidePropsContext) {
    try {
      const cookies = nookies.get(ctx);
      const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);

      // User is authenticated!
      this.userId = token.uid;
      return { userId: token.uid, email: token.email };
    } catch (_) {
      return { userId: null, email: null };
    }
  }

  public getUserData = async <T extends UserData>(
    field: T,
  ): Promise<TUserData<T>> => {
    // Ensure we are initialized
    if (!this.userId) {
      throw new Error('UserDataApi: Ensure you have initialized first.');
    }

    try {
      const doc = await firebaseAdmin
        .firestore()
        .collection('users')
        .doc(this.userId)
        .get();

      const userData = await doc.data();

      return userData ? (userData?.[field] as TUserData<T>) : null;
    } catch (error) {
      return null;
    }
  };

  public setUserData = async <T extends UserData>(
    field: T,
    value: TUserData<T>,
  ) => {
    // Ensure we are initialized
    if (!this.userId) {
      throw new Error('UserDataApi: Ensure you have initialized first.');
    }

    try {
      await firebaseAdmin
        .firestore()
        .collection('users')
        .doc(this.userId)
        .update({
          [field]: value,
        });

      return value;
    } catch (e) {
      return null;
    }
  };
}