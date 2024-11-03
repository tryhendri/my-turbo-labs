import express from 'express';
import cors from 'cors';
import { firebase } from '../config/firebaseConfig';
import { userRoutes } from '../routes/userRoutes';
import { AppOptions, initializeApp } from 'firebase-admin/app';

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.initializeFirebase();
    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  private initializeFirebase() {
    try {
      initializeApp(firebase as AppOptions);
    } catch (error: any) {
      if (!/already exists/.test(error.message)) {
        console.error('Firebase initialization error', error.stack);
      }
    }
  }

  private initializeMiddlewares() {
    this.app.use(cors({ origin: '*', credentials: true }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeRoutes() {
    this.app.use('/api/v1', userRoutes);
  }

  public listen() {
    const PORT = process.env.PORT || 3001;
    this.app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }
}

export default App;
