import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
	name: {
		type: String
	},
	comment: {
		type: String
	}
})

const requestSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['REFUNDS', 'INVOICE', 'LOAN', 'UPFRONT', 'STIPEND', 'OTHER'],
        default: 'REFUNDS',
        required: true,
    },
    status: {
        type: String,
        enum: ['PENDING', 'NEEDS APPROVAL', 'APPROVED', 'RESOLVED', 'CANCELED'],
        default: 'PENDING',
        required: true
    },
    owner: {
        type: String,
        required: true
	},
		ownerEmail: {
        type: String,
	},
	createdBy: {
		type: String,
		required: true
		},

    amount: {
        type: Number,
        required: true,
	},
		title: {
        type: String,
        required: true
	},
    description: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
    },
    imageUrl: {
        type: String
	},
		approvedBy: {
			type: String,
			default: 'anthony.izekor@decagon.dev'
	},
		comment: [commentSchema]
});

export default mongoose.model("FundRequests", requestSchema);
