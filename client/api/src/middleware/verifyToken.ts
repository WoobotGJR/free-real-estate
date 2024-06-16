import 'dotenv/config';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json('You are not authenticated!');

  jwt.verify(token, process.env.JWT_SECRET as string, (err: any) => {
    if (err) return res.status(403).json('Token is not valid!');

    next();
  });
};

export default verifyToken;
