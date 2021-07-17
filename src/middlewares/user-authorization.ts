import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const userAuthorization = (req: any, res: Response, next: NextFunction) => {
	try {
		const token = req.headers.authorization.split(' ')[1];

		const jwtSecret: any = process.env.JWT_SECRET;
		const decode: any = jwt.verify(token, jwtSecret);

		const { email, azureId } = decode;

		req.user = { owner: azureId, createdBy: azureId, email };
		next();

	} catch (error) {
		console.log('there is an error', error);
		error.status = 401;
		error.message = "Permission denied";
		next(error);
	}

};

const agentAuthorization = (
	req: any,
	res: Response,
	next: NextFunction
) => {
	const token = req.headers.authorization.split(' ')[1];

	const jwtSecret: any = process.env.JWT_SECRET;
	const decode: any = jwt.verify(token, jwtSecret);

	const { email, oid: azureId, isAgent } = decode;

	if (!isAgent) {
		return res.status(401).json({
			message: "permission denied"
		})
	}

	req.user = { owner: req.params.owner, createdBy: azureId, isAgent: true };
	next()
};


const adminAuthorization = (
	req: any,
	res: Response,
	next: NextFunction
) => {
	const token = req.headers.authorization.split(' ')[1];

	const jwtSecret: any = process.env.JWT_SECRET;
	const decode: any = jwt.verify(token, jwtSecret);

	const { email, oid: azureId, isAdmin } = decode;

	if (!isAdmin) {
		return res.status(401).json({
			message: "permission denied"
		})
	}

	req.user = { owner: req.params.owner, createdBy: azureId, isAdmin: true };
	next();
};

export default {
	userAuthorization,
	agentAuthorization,
	adminAuthorization,
};
