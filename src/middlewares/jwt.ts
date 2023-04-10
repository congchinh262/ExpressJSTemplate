import { Request, Response, NextFunction } from "express";
import { JWT_CONFIGS } from "../config";
import jwt from "jsonwebtoken";
import { CustomRequest } from "../types";


export const validateJwt = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.headers["authorization"]) {
      return res.status(400).send({
        success: false,
        message: "No access token provided!",
      });
    }
    const accessToken = req.headers["authorization"].split(" ")[1];
    try {
      const decoded = <any>jwt.verify(accessToken, JWT_CONFIGS.SECRET);
      (req as CustomRequest).userId = decoded.userId;
      (req as CustomRequest).userType = decoded.type;
      const {userId,type,exp}=decoded;
      if(Date.now()>=exp*1000){
        return res.status(401).send({
          success:false,
          message: "Token expired!"
        })
      }
      next();
    } catch (e) {
      return res.status(401).send({
        success: false,
        message: e,
      });
    }
  };