import * as msal from '@azure/msal-node';

const config: msal.Configuration = {
	auth: {
			clientId: process.env.CLIENTID!,
			authority: `https://login.microsoftonline.com/${process.env.AUTHORITY}`,
			clientSecret: process.env.CLIENTSECRET
	},
	system: {
			loggerOptions: {
					loggerCallback(loglevel: any, message: any, containsPii: any) {
							console.log(message);
					},
					piiLoggingEnabled: false,
					logLevel: msal.LogLevel.Verbose,
			}
	}
};


export default config
