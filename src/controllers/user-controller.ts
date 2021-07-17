import { Request, Response } from 'express';
import User from '../models/user-model';

const userController = async (req: Request, res: Response) => {
	const users = await User.find({});

	return res.status(200).json(users)
}


export default userController
