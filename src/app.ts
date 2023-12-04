import cors from 'cors';
import express, {
  Request as ExRequest,
  Response as ExResponse,
  NextFunction,
  json,
  urlencoded
} from "express";
import fs from 'fs';
import mongoose from "mongoose";
import { RegisterRoutes } from './routes';
import swaggerUi = require('swagger-ui-express');


import { ValidateError } from 'tsoa';
import './components/comments/comments.controller';
import './components/delivery/delivery.controller';
import './components/foods/foods.controller';
import './components/gallery/gallery.controller';
import './components/order-details/order-details.controller';
import './components/orders/orders.controller';
import './components/sellers/sellers.controller';
import './components/users/users.controller';

const app = express();

mongoose.connect(process.env.MONGO_DB ?? '', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  user: process.env.MONGO_USER,
  pass: process.env.MONGO_PASS,
  dbName: process.env.MONGO_DB_NAME,
}).then(() => console.log('Connected to mongodb')).catch(err => { console.log(process.env.MONGO_DB); console.log({ err }) });

app.use(cors());

/* Swagger files start */
const swaggerFile: any = (process.cwd() + "/swagger.json");
const swaggerData: any = fs.readFileSync(swaggerFile, 'utf8');
const swaggerDocument = JSON.parse(swaggerData);
/* Swagger files end */

app.use(
  urlencoded({
    extended: true,
  })
);
app.use(json());

RegisterRoutes(app);

app.use(function errorHandler(
  err: unknown,
  req: ExRequest,
  res: ExResponse,
  next: NextFunction
): ExResponse | void {
  if (err instanceof ValidateError) {
    console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
    return res.status(400).json({
      message: err.message,
      details: err?.fields,
    });
  }
  if (err instanceof Error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }

  next();
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//missed routes
app.use(function notFoundHandler(_req, res: ExResponse) {
  res.status(404).send({
    message: "Not Found",
  });
});

export { app };

