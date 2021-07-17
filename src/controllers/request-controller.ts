import { Request, Response, NextFunction } from "express";
import FundRequests from "../models/request-model";
import config from "../config/request-config";
import fs from "fs";
import sendEmailNotification from './email-notification';

const mongoose = require("mongoose");

type Obj = {
	type: string,
	owner: string,
	ownerEmail: string,
	amount: number,
	description: string,
	createdAt: Date,
	title: string,
	createdBy: string,
	imageUrl?: string | undefined,
	approvedBy: string[]
};
const requestTypes = [
	"REFUNDS",
	"INVOICE",
	"LOAN",
	"UPFRONT",
	"STIPEND",
	"OTHER",
];

async function createRequest(req: any, res: Response, next: NextFunction) {
	let result;
    try {
        if (req.file) {
            result = await config.cloudinary.uploader.upload(req.file.path);
            fs.unlinkSync(req.file.path);
				}

		const { owner, createdBy} = req.user;
			let { type, title, amount, description, approvedBy, ownerEmail } = req.body;
			approvedBy = 'anthony.izekor@decagon.dev'
    const obj: Obj = { type, amount, title, description, createdAt: new Date(), owner, ownerEmail, createdBy, approvedBy }
    let errors = [];

        Object.entries(obj).forEach(([key, value]) => {
            if (!value) errors.push(`${key} is required`)
        });

        if (type && !requestTypes.includes(type.toUpperCase())) errors.push(`Type must be one of ${requestTypes.join(", ")}`);
        //if (errors.length) return res.status(400).json({ errors });

        if (result) {
            obj.imageUrl = result.url;
        }
			obj.type = type.toUpperCase();
			// res.status(201).json({ status: "Success", data: obj})
			const request = await new FundRequests(obj).save();
			const notification = await sendEmailNotification(obj);
			 res.status(201).json({ status: "Success", data: request})

    } catch (error) {
        console.log(error);

        return res.status(500).send(error.message);
		}
}

async function getRequests(req: any, res: Response, next: NextFunction) {
	try {
		const { isAdmin, isAgent, owner } = req.user;
		const { type } = req.query;
		if (type && !requestTypes.includes(type.toUpperCase()))
			return res
				.status(400)
				.json({
					status: "Failed",
					message: `Type must be one of ${requestTypes.join(", ")}`,
				});

		let prev = null;
		let next = null;
		let limit:any = 5;
		let {page = 1 } = req.query;
		limit = parseInt(limit);
	  page = parseInt(page);


		let criteria = {};
		if (!isAdmin && !isAgent) criteria = { ...criteria, owner };
		if (type) criteria = { ...criteria, type: type.toUpperCase() };

		const count = await FundRequests.countDocuments(criteria);
			if (page > 1) prev = page - 1;
		if (page * limit < count) next = page + 1;

		const requests = await FundRequests.find(criteria).limit(limit).skip((page-1)*limit);
		return res.status(200).json({ status: "Success", data: requests, pagination: {prev, next, total:count, current: page}});
	} catch (error) {
		console.log("this is an error", error);
		next(error);
	}
}


async function updateRequest(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const { id } = req.params;
		const incomingData = req.body;
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(404).json({
				message: `Request with id ${id} not found`,
			});
		}

		let requestData:any = await FundRequests.findById(id);
		requestData["type"] = incomingData.type|| requestData["type"];
		requestData["amount"] = incomingData.amount || requestData["amount"];
		requestData["title"] = incomingData.title || requestData["title"];
		requestData["description"] = incomingData.description || requestData["description"];
		requestData["image"] = incomingData.image || requestData["image"];
		requestData["comment"] = incomingData.comment || requestData["comment"];
		requestData["status"] = incomingData.status || requestData["status"];




			const result = await requestData.save();

			res.status(200).json({
				status: true,
				message: `Request with id ${id} updated successfully`,
				data: result
		});
	} catch (error) {
		return res.status(500).json({
			status: false,
			message: "Internal server error"
	})
	}
}

async function commentOnRequest(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const { id } = req.params;
		const incomingData = req.body;
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(404).json({
				message: `Request with id ${id} not found`,
			});
		}

		console.log(id, incomingData)

		let requestData:any = await FundRequests.findById(id);
		requestData["type"] = incomingData.type|| requestData["type"];
		requestData["amount"] = incomingData.amount || requestData["amount"];
		requestData["title"] = incomingData.title || requestData["title"];
		requestData["description"] = incomingData.description || requestData["description"];
		requestData["image"] = incomingData.image || requestData["image"];
	requestData["comment"].push({ name: incomingData.name, comment: incomingData.comment });
	requestData['approvedBy'] = '';

		console.log(requestData)

			const result = await requestData.save();

			res.status(200).json({
				status: true,
				message: `Request with id ${id} updated successfully`,
				data: result
		});
	}
	catch(error){
		return res.status(500).json({
			status: false,
			message: "Internal server error"
	})
	}
}

async function closeRequest(req: Request,
	res: Response,) {
	try {
			const { id } = req.params;
			if (!mongoose.Types.ObjectId.isValid(id)) {
				return res.status(404).json({
					message: `Request with id ${id} not found`,
				});
			}
			FundRequests.findByIdAndDelete(id).then((result) => {
					if (!result) {
							return res.status(404).json({
									status: false,
									message: `Request with id ${id} not found`
							});
					}
					res.status(200).json({
							status: true,
							message: `Request with id ${id} deleted successfully`
					});
			});
	} catch (error) {
			return res.status(500).json({
					status: false,
					message: "Internal server error"
			})
	}
}

export default { createRequest, getRequests, updateRequest, commentOnRequest, closeRequest };
