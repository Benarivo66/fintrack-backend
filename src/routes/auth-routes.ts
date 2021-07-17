import express from 'express';
import authController from '../controllers/auth-controller';
import requireSignIn from '../middlewares/auth'

const router = express.Router();

router.get('/', (req, res) => {
	res.status(200).json({
		message: 'welcome'
	})
})

router.get('/login', authController.getAuth);

router.get('/redirect', authController.getResponse);

router.get('/logout', requireSignIn, authController.logOut);

export default router;
