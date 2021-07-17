import { Request, Response } from 'express';
import Agent from '../models/agent-model';

const agentController = async (req: Request, res: Response) => {
	const agents = await Agent.find({});

	return res.status(200).json(agents);
}

export default agentController
