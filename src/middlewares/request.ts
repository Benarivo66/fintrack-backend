import { Request, Response, NextFunction } from "express";
//import jwt from "jsonwebtoken";
import User from "../models/user-model";
import Agent from "../models/agent-model";
import Admin from "../models/admin-model";

const setUserRole = async (req: any, res: Response, next: NextFunction) => {
	try {
		const email = req.user.email;
		const admin = await Admin.findOne({ email: email })
		const agent = await Agent.findOne({ email: email })
		if (admin) req.user.isAdmin = true;
		if (agent) req.user.isAgent = true;
	next();
	} catch (error) {
		console.log('there is an error', error);
		next(error);
	}

};

export default setUserRole;
