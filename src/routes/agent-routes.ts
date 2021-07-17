import express from 'express';
import requireSignin from '../middlewares/auth';
import agentController from '../controllers/agent-controller';
import userAuthorization from "../middlewares/user-authorization";

const router = express.Router();

router.get('/', requireSignin, userAuthorization.agentAuthorization, agentController);

export default router
