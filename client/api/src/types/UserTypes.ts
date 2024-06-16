import { Request } from 'express';

interface IUser {
  id: string;
  username: string;
  email: string;
  avatar: string;
  password: string;
}

interface MyRequest extends Request {
  userId: string;
  body: IUser;
}

export type { IUser, MyRequest };
