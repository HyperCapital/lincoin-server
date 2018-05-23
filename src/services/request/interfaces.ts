import { Router, Request, Response } from "express";
import { ISession } from "../session";

export interface IRequestController {
  path: string;
  router: Router;
}

export interface IHttpRequest extends Request {
  authenticate(sendError?: boolean): ISession;
}

export interface IHttpResponse extends Response {
  sendError(code: number, data?: any): void;
}
