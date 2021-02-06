import "reflect-metadata";

import express, { NextFunction, Request, Response } from "express";
import cors from 'cors';
import 'express-async-errors';

import routes from "./shared/routes";
import uploadConfig from './config/upload';

import "./shared/database";
import AppError from "./shared/errors/AppError";

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.directory));
app.use(routes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

app.listen(3333, () => {
  console.log("Server running at port 3333!");
});
