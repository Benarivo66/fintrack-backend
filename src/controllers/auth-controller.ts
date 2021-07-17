import * as msal from '@azure/msal-node';
import jwt from 'jsonwebtoken';
import authConfig from '../config/auth-config';
import { registerUser } from '../helpers';
import { Request, Response } from 'express';
import Admin from '../models/admin-model';
import Agent from '../models/agent-model';
import User from '../models/user-model';

type decod = {
		given_name: string,
		family_name: string,
		email: string,
		oid: string
}

const cca = new msal.ConfidentialClientApplication(authConfig);

let redirectUri = process.env.REDIRECT_URI!;

const getAuth = (req: Request, res: Response) => {
	const authCodeUrlParameters = {
		scopes: ["user.read"],
		redirectUri: redirectUri
	};

	cca.getAuthCodeUrl(authCodeUrlParameters).then((response) => {
		console.log('this is the response', response);
		res.redirect(response);

	}).catch((error) => console.log(JSON.stringify(error)));
}


const getResponse = (req: Request, res: Response) => {
	const code = req.query.code as string;
	const tokenRequest: msal.AuthorizationCodeRequest = {
		code: code,
		scopes: ["user.read"],
		redirectUri: redirectUri,
	};

	cca.acquireTokenByCode(tokenRequest).then(async (response) => {
		const token = response?.accessToken!;
		const decoded = jwt.decode(token) as decod;
		const firstName = decoded.given_name;
		const lastName = decoded.family_name;
		const email = decoded.email;
		const azureId = decoded.oid;

		const jwtSecret = process.env.JWT_SECRET!;

		if (!email) {
			return res.status(401).json({
				error: 'User account not found'
			})
		}

		const userObj = {
			firstName,
			lastName,
			email,
			azureId,
			isAgent: false,
			isAdmin: false
		};

		let admin = await Admin.find({ email: email });
		if (admin.length > 0) {
			userObj.isAdmin = true;
			userObj.isAgent = true;
		}

		let agent = await Agent.find({ email: email });
		if (agent.length > 0) {
			userObj.isAgent = true;
		}

		const jwtToken = jwt.sign(userObj, jwtSecret);

		res.cookie('token', jwtToken, {
			maxAge: 604800000
		});

		let user = await User.find({ email: email });

		if (user.length < 1) {
			registerUser(res, firstName, lastName, email, azureId);
		} else {
				// 	return res.status(200).json({
				// 		message: 'User login successful'
				// 	})

			 admin.length > 0 ? res.redirect(`${process.env.FRONTEND_URL}/admin-dashboard`) : res.redirect(`${process.env.FRONTEND_URL}/dashboard`);

			//  res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
		}

	}).catch((error) => {
		res.status(500).send(error);
	});
}


const logOut = (req: Request, res: Response) => {
	res.clearCookie('token');
	res.status(200).json({
		messsage: 'logged out successfully'
	})
}

export default {
	getAuth,
	getResponse,
	logOut
}
