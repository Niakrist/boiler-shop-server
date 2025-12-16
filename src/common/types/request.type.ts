import { Request } from 'express';
import { IUser } from 'src/user/types';

export interface AuthenticatedRequest extends Request {
  user: IUser; // Используем существующий интерфейс IUser
}
