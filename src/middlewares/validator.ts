import express, { NextFunction, Request, Response } from "express";
import { ValidationChain, validationResult } from "express-validator";
import HttpStatusCodes from "../constants/HttpStatusCode";
import { log } from "../utils/log";

export const validateAPIRequest = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if (result.context.errors.length > 0) {
        break;
      }
    }
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    return res.status(HttpStatusCodes.BAD_REQUEST).json({ errors: errors.array() });
  };
};

export const validateRequestMethod = (app: express.Application) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { method, path } = req;
    const routes = app._router.stack;
    for (const layer of routes) {
      if (layer.route && layer.route.path === path) {
        if (layer.route.methods[method.toLowerCase()]) {
          return next();
        }
        break;
      }
    }
    return res.status(HttpStatusCodes.METHOD_NOT_ALLOWED).json({ error: "Method Not Allowed" });
  };
};
