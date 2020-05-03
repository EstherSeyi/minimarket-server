import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';

import User from '../models/User';
import { IUser } from '../models/User';
import { loginSchema } from '../validation/auth';
import sendResponse from '../utils/response';

export async function login(req: Request, res: Response) {
  // Validating request body

  const { value, error } = loginSchema.validate(req.body);

  if (error) {
    res.status(httpStatus.BAD_REQUEST).send(
      sendResponse({
        message: 'Provide your email and password',
        error,
      }),
    );
    return;
  }

  try {
    const { email, password } = value;

    //Getting user from db
    const user = await User.findOne({
      email,
    });

    //User not found ? respond with an error
    if (!user) {
      res.status(httpStatus.UNAUTHORIZED).send(
        sendResponse({
          message: 'Invalid Email!',
        }),
      );
      return;
    }

    const suspectedUser = user.toObject();

    //compare password with password in db
    return bcrypt
      .compare(password, suspectedUser.password)
      .then((validPassword) => {
        //Not a match? Send error response to client
        if (!validPassword) {
          res.status(httpStatus.UNAUTHORIZED).send(
            sendResponse({
              message: 'Incorrect Password!',
            }),
          );
          return;
        }

        //Generates and sends token
        const token = signToken(user);

        const response = sendResponse({
          message: 'success',
          token,
        });

        res.status(httpStatus.OK).json(response);
      });
  } catch (error) {
    res.status(400).json({ message: error.message, error });
  }
}

const secretToken = `${process.env.ACCESS_TOKEN_SECRET}`;
function signToken(user: IUser) {
  return jwt.sign({ email: user.email }, secretToken);
}
