import { Router } from 'express';
import { APIController } from '../controller/api';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
const apiController = new APIController();

router.get('/fetch-user-data', authMiddleware, apiController.getUserProfile);
router.put('/update-user-data/:id', authMiddleware, apiController.updateUserProfile);

export { router as userRoutes };
