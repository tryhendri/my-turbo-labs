import dotenv from 'dotenv';
import admin from 'firebase-admin';

import serviceAccount from '../ebuddy-test-f27fd-firebase-adminsdk-o48uq-faa5dfd778.json';

dotenv.config();

export const firebase = admin.apps.length
  ? admin.app()
  : admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
