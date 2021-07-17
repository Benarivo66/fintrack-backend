import { Router } from 'express';
import requireSignin from '../middlewares/auth';
import controllers from '../controllers/request-controller';
import config from '../config/request-config';
import userMiddleware from '../middlewares/user-authorization';
import setUserRole from '../middlewares/request';

const {  agentAuthorization, adminAuthorization } = userMiddleware;

const router = Router();

router.get("/", requireSignin, setUserRole, controllers.getRequests);
router.post("/", requireSignin, config.upload.single("image"), controllers.createRequest);
router.post("/agent/:owner", requireSignin, agentAuthorization, config.upload.single("image"), controllers.createRequest);
router.post("/admin/:owner", requireSignin, adminAuthorization, config.upload.single("image"), controllers.createRequest);
router.put("/:id", requireSignin, adminAuthorization, config.upload.single("image"), controllers.updateRequest);
router.put("/comment/:id", config.upload.single("image"), controllers.commentOnRequest);
router.delete("/:id", controllers.closeRequest);

export default router;
//userAuthorization
