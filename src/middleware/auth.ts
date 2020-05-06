import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';

import sendResponse from '../utils/response';

export default function auth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers['authorization'];

  if (!token) {
    res.status(httpStatus.FORBIDDEN).send(
      sendResponse({
        message: 'No Token, Access Denied!',
      }),
    );

    return;
  }

  try {
    const reqToken = token.split(' ')[1];
    jwt.verify(reqToken, `${process.env.ACCESS_TOKEN_SECRET}`);
    next();
  } catch (error) {
    res.status(httpStatus.UNAUTHORIZED).send(
      sendResponse({
        message: 'Unauthorized User!',
        error,
      }),
    );
    return;
  }
}
