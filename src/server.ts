import { createServer } from "http";

import express, { Request, Response } from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import morgan from 'morgan';
import helmet from 'helmet';
import { NODE_ENV } from "./config";


dotenv.config();
const port = process.env.PORT || 8080;
const app = express();
const server = createServer(app);

// app.options("*", cors());
app.use(express.json());
app.use(cors());
// app.use(express.urlencoded({ extended: false }));

/* This code block is checking the value of the `NODE_ENV` environment variable. If it is set to
`'development'`, it will use the `morgan` middleware to log HTTP requests to the console. If it is
not set to `'development'`, it will use the `helmet` middleware to add security headers to HTTP
responses. This is a common pattern in Node.js applications to conditionally enable middleware based
on the environment the application is running in. */
if(NODE_ENV==='development'){
  app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
}
if(NODE_ENV!=='development'){
  app.use(helmet());
}


// Defind route route
app.get("/", (req: Request, res: Response) => res.send("Halo!!"));
export const startApp = () => {
  server.listen(port, () => {
    console.log(`App is running at port: ${port}`);
  });
};
