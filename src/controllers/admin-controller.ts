import { request, Request, Response } from 'express';
import Admin from '../models/admin-model';
import User from '../models/user-model';
import Agent from '../models/agent-model';
import FundRequest from '../models/request-model';
import { getMinTime } from '../helpers';
import FundRequests from "../models/request-model";


const adminController = async (req: Request, res: Response) => {
	const admins = await Admin.find({});

	return res.status(200).json(admins);
}

const updateRole = (req: Request, res: Response) => {
	const { email, role } = req.body;

	User.findOne({ email: email }).then((user: any) => {
		if (!user) {
			return res.status(401).json({
				error: 'user does not exist'
			})
		}

		if (role === 'agent') {
			const newAgent = new Agent({
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				id: user.id
			});

			newAgent.save().then((result) => {
				return res.status(201).json({
					message: 'User role successfully updated to agent'
				})
			}).catch((err) => {
				return res.status(401).json({
					error: 'User is already an Agent'
				})
			})
		}

		if (role === 'admin') {
			const newAdmin = new Admin({
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				id: user.id
			});

			newAdmin.save().then((result) => {
				return res.status(201).json({
					message: 'User role successfully updated to admin'
				})
			}).catch((err) => {
				return res.status(401).json({
					error: 'User is already an Admin'
				})
			})
		}
	})
}

const getRequestsByAgent = async (req: Request, res: Response) => {
	const id = req.query.id;

	try {
		const agent = await Agent.find({ id });

		if (agent.length !== 0) {
			let requests = await FundRequest.find({ createdBy: id });
			res.status(200).json(requests);
		} else {
			return res.status(400).json({
				error: 'agent does not exist'
			})
		}

	} catch(err) {
		return res.status(400).json({
			error: 'could not get requests by agent'
		})
	}
}

const getRequestsBySLA = async (req: Request, res: Response) => {
	const minTime = getMinTime(1);

	try {
		let requests = await FundRequest.find({ createdAt: { '$gte': minTime } });
		res.status(200).json(requests);
	} catch (err) {
		return res.status(400).json({
			error: 'could not get requests by SLA'
		})
	}

}


const getRequestsByStatus = async (req: Request, res: Response) => {
	let status: any = req.query.status;

	if (typeof status !== 'string') {
		return res.status(400).json({
			error: 'status must be of type string'
		})
	}

	status = status.toUpperCase();
	try {
		let requests = await FundRequest.find({ status });
		res.status(200).json({ status: 'Success', data:requests});
	} catch (err) {
		return res.status(400).json({
			error: 'could not get requests by status'
		})
	}
}

const getRequestsByTime = async (req: Request, res: Response) => {
	let start = req.query.start;
	let end = req.query.end;

	if (!end) {
		end = new Date().toISOString();
	}

	try {
		let requests = await FundRequest.find({ createdAt: { '$gte': start, '$lte': end } });
		res.status(200).json(requests);
	} catch (err) {
		return res.status(400).json({
			error: 'could not get requests by time'
		})
	}
}

const getRequestsByType = async (req: Request, res: Response) => {
	let type: any = req.query.type;

	if (typeof type !== 'string') {
		return res.status(400).json({
			error: 'type must be of type string'
		})
	}

	type = type.toUpperCase();

	try {
		let requests = await FundRequest.find({ type });
		res.status(200).json(requests);
	} catch (err) {
		return res.status(400).json({
			error: 'could not get requests by type'
		})
	}
}

const getRequestsByUser = async (req: Request, res: Response) => {
	const id = req.query.id;

	try {
		let requests = await FundRequest.find({ createdBy: id });
		res.status(200).json(requests);
	} catch (err) {
		return res.status(400).json({
			error: 'could not get requests by user'
		})
	}
}

const adminAnalytic = async (req: Request, res: Response) => {
	try {
		const requests: any = await FundRequests.find({})
		// user categories
		const countUsers = await User.countDocuments();
		const countAdmin = await Admin.countDocuments();
		const countAgent = await Agent.countDocuments();

		let countOnlyUsers = countUsers - (countAdmin + countAgent);
		let userCategoryObj = {
			countOnlyUsers,
			countAdmin,
			countAgent,
			countUsers
		}
		//user categories end
		let pendingNumber = 0,
    approvedNumber = 0,
    resolvedNumber = 0,
		canceledNumber = 0,
		refundsNumber = 0,
		invoiceNumber = 0,
		loanNumber = 0,
		stipendNumber = 0,
		upfrontNumber = 0,
		otherNumber = 0



		for (let elem of requests) {
                if (elem.status.toUpperCase() == 'PENDING') pendingNumber += 1;
                if (elem.status.toUpperCase() == 'APPROVED') approvedNumber += 1;
                if (elem.status.toUpperCase() == 'RESOLVED') resolvedNumber += 1;
                if (elem.status.toUpperCase() == 'CANCELED') canceledNumber += 1;
								if(elem.type.toUpperCase() == 'INVOICE') invoiceNumber += 1;
								if(elem.type.toUpperCase() == 'LOAN') loanNumber += 1;
								if (elem.type.toUpperCase() == 'STIPEND') stipendNumber += 1;
								if (elem.type.toUpperCase() == 'REFUNDS') refundsNumber += 1;
								if (elem.type.toUpperCase() == 'UPFRONT') upfrontNumber += 1;
								if(elem.type.toUpperCase() == 'OTHER') otherNumber += 1;
		}
		let obj = {
			pendingNumber,
			resolvedNumber,
			canceledNumber,
			approvedNumber,
			total: requests.length,
			invoiceNumber,
			loanNumber,
			stipendNumber,
			refundsNumber,
			upfrontNumber,
			otherNumber
		}

				return res.status(200).json({ status: "Success", data: obj, userData: userCategoryObj});


	} catch (error) {
		console.log("this is an error", error);
	}
}

export default {
	adminController,
	updateRole,
	getRequestsByAgent,
	getRequestsBySLA,
	getRequestsByStatus,
	getRequestsByTime,
	getRequestsByType,
	getRequestsByUser,
	adminAnalytic
}

//'REFUNDS', 'INVOICE', 'LOAN', 'UPFRONT', 'STIPEND', 'OTHER'
