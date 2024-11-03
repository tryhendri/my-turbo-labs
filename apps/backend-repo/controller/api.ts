import { Request, Response } from 'express';

import { UpdateUserData } from '@my-turbo-labs/shared';

import { UserCollection } from '../repository/userCollection';

export class APIController {
  public userCollection: UserCollection;

  constructor() {
    this.userCollection = new UserCollection();
  }

  getUserProfile = async (req: Request, res: Response) => {
    try {
      const userId: string = req.query.id as string;
      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const user = await this.userCollection.findById(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.json(user);
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  updateUserProfile = async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;
      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const updateData: UpdateUserData = req.body;

      const updatedUser = await this.userCollection.update(userId, updateData);

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.json(updatedUser);
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
}
