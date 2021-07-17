import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import emailConfig from '../config/email-config';



const { PASSWORD, EMAIL, MAIN_URL }: any = emailConfig;

let transporter = nodemailer.createTransport({
	service: "gmail",
	host: "smtp.gmail.com",
  secure: true,
	auth: {
    user: EMAIL,
		pass: PASSWORD,
  },
});

let MailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Fintrack",
    link: MAIN_URL
  },
});

const sendEmailNotification = async (obj:any) => {

	//const name = obj.ownerEmail.split('.')[0].toUpperCase();
	const name = "Sir/Madam";

  let response = {
    body: {
      name,
			intro: `This is to notify you that the user with email ${obj.ownerEmail} now has a new financial request with the following information:
								Title: ${obj.title},
								Amount: ${obj.amount},
								Description: ${obj.description}.`,
    },
  };

  let mail =  MailGenerator.generate(response);

  let message = {
    from: EMAIL,
    to: obj.approvedBy,
    subject: "Request for Fund",
    html: mail,
  };

  const result = transporter
    .sendMail(message)
    .then(() => {
			return 'email sent';
    })
		.catch((error) => console.error(error));
	return result
};

export default sendEmailNotification;
