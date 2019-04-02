import express from 'express';
import userRouter from '../routes/userRoutes';


const router = express.Router();
router.use(userRouter);

export default router;
