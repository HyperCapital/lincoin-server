"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const metaKey = Symbol();
function requestController(path = null) {
    return (constructor) => {
        const target = constructor.prototype;
        return class extends constructor {
            constructor() {
                super(...arguments);
                this.path = path;
            }
            get router() {
                const router = express_1.Router();
                const routes = Reflect.getMetadata(metaKey, target) || [];
                const self = this;
                routes.forEach(({ method, path, property }) => {
                    const action = self[property].bind(self);
                    if (router[method]) {
                        router[method](path, (req, res, next) => {
                            try {
                                const promise = action(req, res, next);
                                if (promise instanceof Promise) {
                                    promise.catch((err) => next(err));
                                }
                            }
                            catch (err) {
                                next(err);
                            }
                        });
                    }
                });
                return router;
            }
        };
    };
}
exports.requestController = requestController;
function createRouteDecorator(method) {
    return (path = "/") => (target, property) => {
        const route = {
            method,
            path,
            property,
        };
        Reflect.defineMetadata(metaKey, [
            ...(Reflect.getMetadata(metaKey, target) || []),
            route,
        ], target);
    };
}
exports.httpAll = createRouteDecorator("all");
exports.httpGet = createRouteDecorator("get");
exports.httpPost = createRouteDecorator("post");
exports.httpPut = createRouteDecorator("put");
exports.httpDel = createRouteDecorator("delete");
