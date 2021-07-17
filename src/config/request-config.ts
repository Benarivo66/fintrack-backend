import multer from "multer";
import dotenv from 'dotenv';
const cloudinary = require('cloudinary').v2;
 
dotenv.config();

//cloudinary configuration
cloudinary.config({
cloud_name: process.env.CLOUD_NAME,
api_key: process.env.API_KEY,
api_secret: process.env.API_SECRET
});

//multer configuration
const upload = multer({ dest: 'tmp/' });

export default { cloudinary, upload };
