import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { Request, Response } from 'express';

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // bcrypt
    const encryptedPassword = await bcrypt.hash(password, 10);
    console.log(encryptedPassword);

    // create user
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: encryptedPassword,
      },
    });

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    // check if user exists
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    // check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect)
      return res.status(401).json({ message: 'Invalid credentials' });

    // generate token
    const age = 1000 * 60 * 60 * 24 * 7; // 1 week

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: age,
    });

    const { password: userPassword, ...otherUserInfo } = user;

    // send token
    res
      .cookie('JWT_TOKEN', token, {
        httpOnly: true,
        maxAge: age,
      })
      .status(200)
      .json(otherUserInfo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to login' });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie('JWT_TOKEN');
  res.status(200).json({ message: 'Logged out successfully' });
};
