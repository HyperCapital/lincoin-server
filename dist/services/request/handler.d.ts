/// <reference types="winston" />
/// <reference types="node" />
import { Server } from "http";
import { LoggerInstance } from "winston";
import { ISessionManager } from "../session";
import { IRequestController } from "./interfaces";
/**
 * Request handler service
 */
export declare class RequestHandler {
    protected logger: LoggerInstance;
    protected sessionManager: ISessionManager;
    protected controllers: IRequestController[];
    constructor(httpServer: Server, logger: LoggerInstance, sessionManager: ISessionManager, controllers: IRequestController[]);
    private readonly router;
    private middleware(req, res, next);
    private status404Handler(req, res);
    private status500Handler(err, req, res, next);
}
