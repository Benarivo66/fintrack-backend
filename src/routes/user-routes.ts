import express from 'express';
import requireSignin from '../middlewares/auth';
import userController from "../controllers/user-controller"

const router = express.Router();

router.get('/', requireSignin, userController);

export default router
