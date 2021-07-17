import express from 'express';
import requireSignin from '../middlewares/auth';
import adminController from '../controllers/admin-controller';
import userAuthorization from "../middlewares/user-authorization";

const router = express.Router();

router.get('/', requireSignin, userAuthorization.adminAuthorization, adminController.adminController);

router.post('/update', requireSignin, userAuthorization.adminAuthorization, adminController.updateRole);

router.get('/requestsbyagent', requireSignin, adminController.getRequestsByAgent);

router.get('/requestsbysla', requireSignin, adminController.getRequestsBySLA);

router.get('/requestsbystatus', requireSignin, adminController.getRequestsByStatus);

router.get('/requestsbytime', requireSignin, adminController.getRequestsByTime);

router.get('/requestsbytype', requireSignin, adminController.getRequestsByType);

router.get('/requestsbyuser', requireSignin, adminController.getRequestsByUser);

router.get('/admin-analytic', requireSignin, userAuthorization.adminAuthorization, adminController.adminAnalytic);





export default router;
