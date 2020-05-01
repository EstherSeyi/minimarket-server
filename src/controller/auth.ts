import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/User';
import { IUser } from '../models/User';
import { loginSchema } from '../validation/auth';

export async function login(req: Request, res: Response) {
  // Validating request body

  const { value, error } = loginSchema.validate(req.body);

  if (error) {
    throw Error('Provide your email or phone number and password');
  }

  try {
    const { email, password } = value;

    //Getting user from db
    const user = await User.findOne({
      email,
    });

    if (!user) {
      throw Error('Invalid email');
    }

    const suspectedUser = user.toObject();

    //compare password with password in db
    return bcrypt
      .compare(password, suspectedUser.password)
      .then((validPassword) => {
        if (!validPassword) {
          throw Error('Incorrect password');
        }

        //Generates and sends token
        const token = signToken(user);
        res.status(200).json({ token });
      });
  } catch (error) {
    res.status(400).json({ message: error.message, error });
  }
}

const secretToken =
  process.env.ACCESS_TOKEN_SECRET || 'this is a sample seccret';
function signToken(user: IUser) {
  return jwt.sign({ id: user.id }, secretToken);
}
