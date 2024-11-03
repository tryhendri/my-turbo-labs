import * as admin from 'firebase-admin';
import { UpdateUserData, GetUserData } from '@my-turbo-labs/shared';

export class UserCollection {
  public collection: admin.firestore.CollectionReference;

  constructor() {
    this.collection = admin.firestore().collection('users');
  }

  async findById(id: string): Promise<GetUserData | null> {
    const doc = await this.collection.doc(id).get();

    if (!doc.exists) return null;
    const data = doc.data();

    return {
      ...data,
      id: id,
    } as GetUserData;
  }

  async update(id: string, userData: UpdateUserData): Promise<GetUserData | null> {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) return null;

    const updateData = {
      ...userData,
      updatedAt: new Date(),
    };

    await docRef.update(updateData);

    const updatedDoc = await docRef.get();
    const data = updatedDoc.data();

    return {
      ...data,
      id: data?.id,
      createdAt: data?.createdAt,
      updatedAt: data?.updatedAt,
    } as GetUserData;
  }
}
