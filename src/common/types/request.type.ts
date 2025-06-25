import { Request } from 'express';

export type RequestWithUser = Request & {
  user: {
    id: number;
    email: string;
    rol: 'superadmin' | 'client';
  };
};