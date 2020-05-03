import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';

import User from '../models/User';
import sendResponse from '../utils/response';

export default function auth(req: Request, res: Response, next: NextFunction) {
  try {
    //get Token from authorization headers
    const token = req.headers['authorization'];
    if (!token) {
      res.status(httpStatus.UNAUTHORIZED).send(
        sendResponse({
          message: 'No Token, Unauthorized User!',
        }),
      );

      return;
    }

    const actualToken = token.split(' ')[1];

    //Verify Token
    jwt.verify(
      actualToken,
      `${process.env.ACCESS_TOKEN_SECRET}`,
      async (error: any, payload: any) => {
        if (error) {
          res.status(httpStatus.UNAUTHORIZED).send(
            sendResponse({
              message: 'Unauthorized User!',
              error,
            }),
          );
        }

        let doc = await User.findOne({ email: payload.email }).select({
          password: 0,
        });

        if (doc) {
          req.body.user = doc;
          next();
        } else {
          res.status(httpStatus.UNAUTHORIZED).send(
            sendResponse({
              message: 'Unauthorized User!',
            }),
          );
        }
      },
    );
  } catch (error) {
    res.status(httpStatus.UNAUTHORIZED).send(
      sendResponse({
        message: 'Unauthorized User!',
        error,
      }),
    );
  }
}
