import mongoose from 'mongoose';


const adminSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: 'firstname is required'
	},
	lastName: {
		type: String,
		required: 'lastname is required'
	},
	email: {
		type: String,
		required: 'email is required',
		unique: true
	},
	id: {
		type: String,
		required: 'azure id is required'
	},
	class: {
		type: String,
		default: 'regular'
	},
	department: {
		type: String
	}
}, {
	timestamps: true
});


export default mongoose.model('Admin', adminSchema);
