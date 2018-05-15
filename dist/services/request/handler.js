"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const express = require("express");
const statuses = require("statuses");
const inversify_1 = require("inversify");
const constants_1 = require("../../constants");
const utils_1 = require("../../utils");
/**
 * Request handler service
 */
let RequestHandler = class RequestHandler {
    constructor(httpServer, logger, sessionManager, controllers) {
        this.logger = logger;
        this.sessionManager = sessionManager;
        this.controllers = controllers;
        const app = express()
            .enable("trust proxy")
            .disable("x-powered-by");
        app
            .use(this.middleware.bind(this))
            .use(this.router)
            .use(this.status404Handler.bind(this))
            .use(this.status500Handler.bind(this));
        httpServer.on("request", app);
    }
    get router() {
        const result = express.Router();
        try {
            for (const controller of this.controllers) {
                const { path, router } = controller;
                if (!path) {
                    result.use(router);
                }
                else {
                    result.use(path, router);
                }
            }
        }
        catch (err) {
            this.logger.error("request:handler", err);
        }
        return result;
    }
    middleware(req, res, next) {
        Object.assign(req, {
            authenticate: () => {
                let result = null;
                const hash = req.headers.authorization;
                if (hash && this.sessionManager) {
                    result = this.sessionManager.getHashAddress(utils_1.prepareHex(hash));
                }
                if (!result) {
                    res.sendError(403);
                }
                return result;
            },
        });
        Object.assign(res, {
            sendError: (code, data) => {
                const body = {
                    error: statuses[code],
                };
                if (data) {
                    switch (typeof data) {
                        case "string":
                            body.error = data;
                            break;
                        case "object":
                            Object.assign(body, data);
                            break;
                    }
                }
                res.status(code);
                res.send(body);
            },
        });
        next();
    }
    status404Handler(req, res) {
        res.sendError(404);
        const { method, url } = req;
        this.logger.debug("request:handler:404", {
            method,
            url,
        });
    }
    status500Handler(err, req, res, next) {
        res.sendError(500);
        this.logger.error("request:handler:500", err);
    }
};
RequestHandler = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(constants_1.ConstantNames.HttpServer)),
    __param(1, inversify_1.inject(constants_1.ConstantNames.Logger)),
    __param(2, inversify_1.inject(constants_1.ServiceNames.SessionManager)), __param(2, inversify_1.optional()),
    __param(3, inversify_1.multiInject(constants_1.ServiceNames.RequestController)), __param(3, inversify_1.optional()),
    __metadata("design:paramtypes", [http_1.Server, Object, Object, Array])
], RequestHandler);
exports.RequestHandler = RequestHandler;
