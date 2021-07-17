import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const requireSignIn = (req: any, res: Response, next: NextFunction) => {
	try {
		const jwtSecret: any = process.env.JWT_SECRET;
		const token = req.headers.authorization.split(' ')[1];
		//const token = req.cookies.token;
		const decoded = jwt.verify(token, jwtSecret);

		next();
	} catch (err) {
		return res.status(401).json({
			message: 'login required'
		})
	}
}

export default requireSignIn;
