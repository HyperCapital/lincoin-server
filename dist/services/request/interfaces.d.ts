/// <reference types="express" />
import { Router, Request, Response } from "express";
export interface IRequestController {
    path: string;
    router: Router;
}
export interface IHttpRequest extends Request {
    authenticate(): string;
}
export interface IHttpResponse extends Response {
    sendError(code: number, data?: any): void;
}