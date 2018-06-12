"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
exports.injectable = inversify_1.injectable;
exports.inject = inversify_1.inject;
exports.multiInject = inversify_1.multiInject;
exports.optional = inversify_1.optional;
const constants_1 = require("../constants");
// constants
exports.injectConfig = () => inversify_1.inject(constants_1.ConstantNames.Config);
exports.injectLogger = () => inversify_1.inject(constants_1.ConstantNames.Logger);
// services
exports.injectApn = () => inversify_1.inject(constants_1.ServiceNames.Apn);
exports.injectConnectionManager = () => inversify_1.inject(constants_1.ServiceNames.ConnectionManager);
exports.injectSessionManager = () => inversify_1.inject(constants_1.ServiceNames.SessionManager);
exports.injectNetwork = () => inversify_1.inject(constants_1.ServiceNames.Network);
