import { Request as ExpressRequest } from 'express';

export interface IAuthenticatedRequestInterface extends ExpressRequest {
  user: {
    userId: number;
    email: string;
  };
}
