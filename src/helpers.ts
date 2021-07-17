import User from './models/user-model';
import Admin from './models/admin-model';
import { Response } from 'express';


export const getMinTime = (hoursPassed: any) => {
	let currentDay = new Date().toISOString().split('T')[0];
	let currentTime = new Date().toISOString().split('T')[1].split('.')[0];
	let details = new Date().toISOString().split('T')[1].split('.')[1];

	let result;
	let hour = Number(currentTime.split(':')[0]) - hoursPassed;
	let finalTime: any = currentTime.split(':');
	finalTime[0] = String(hour);
	finalTime = finalTime.join(':');
	result=`${currentDay}T${finalTime}.${details}`

	return result;
}


export const registerUser = (
	res: Response,
	firstName: string,
	lastName: string,
	email: string,
	azureId: string
) => {
	User.find({}).then((users) => {

		if (users.length < 1) {
			const newUser = new User({
				firstName,
				lastName,
				email,
				id: azureId
			});

			const newAdmin = new Admin({
				firstName,
				lastName,
				email,
				id: azureId,
				class: 'super'
			});

			newUser.save().then((result) => {
				newAdmin.save().then((result) => {
					return res.status(201).json({
						message: 'User registered as Super Admin'
					})
				}).catch((err) => {
					return res.status(401).json({
						error: 'User could not be registered as Super Admin'
					})
				})

			}).catch((err) => {
				return res.status(401).json({
					error: 'error creating user'
				})
			})


		} else {
			const newUser = new User({
				firstName,
				lastName,
				email,
				id: azureId
			});

			newUser.save().then((result) => {
				return res.status(201).json({
					message: 'user registered successfully'
				})
			}).catch((err) => {
				return res.status(401).json({
					error: 'error creating user'
				})
			})

		}
	})
}
