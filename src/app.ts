import createError, {HttpError} from 'http-errors';
import express, { Request, Response, NextFunction} from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import logger from 'morgan';
import dbConnnect from './config/db-config';
import auth from './routes/auth-routes';
import userRoute from "./routes/user-routes";
import adminRoute from "./routes/admin-routes";
import agentRoute from "./routes/agent-routes";
import requireSignIn from './middlewares/auth';
import userAuthorization from "./middlewares/user-authorization";
import requestRoutes from './routes/request-routes';

let app = express();

dbConnnect();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
	origin: 'http://localhost:3001',
	credentials: true
}));

app.use('/', auth);
app.use('/user', requireSignIn, userAuthorization.userAuthorization, userRoute);
app.use('/agent', requireSignIn, userAuthorization.agentAuthorization, agentRoute);
app.use('/admin', requireSignIn, userAuthorization.adminAuthorization, adminRoute);
app.use("/request", requireSignIn, userAuthorization.userAuthorization, requestRoutes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err: HttpError, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err.message || "Sorry, something went wrong");
});


export default app;
