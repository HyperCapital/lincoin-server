"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_ID = "default";
var ConstantNames;
(function (ConstantNames) {
    ConstantNames["Config"] = "internal/constant/CONFIG";
    ConstantNames["Logger"] = "internal/constant/LOGGER";
    ConstantNames["HttpServer"] = "internal/constant/HTTP_SERVER";
    ConstantNames["WsServer"] = "internal/constant/WS_SERVER";
})(ConstantNames = exports.ConstantNames || (exports.ConstantNames = {}));
var ServiceNames;
(function (ServiceNames) {
    ServiceNames["Apn"] = "internal/service/APN";
    ServiceNames["ConnectionController"] = "internal/service/CONNECTION_CONTROLLER";
    ServiceNames["ConnectionHandler"] = "internal/service/CONNECTION_HANDLER";
    ServiceNames["ConnectionManager"] = "internal/service/CONNECTION_MANAGER";
    ServiceNames["ContractController"] = "internal/service/CONTRACT_CONTROLLER";
    ServiceNames["ContractHandler"] = "internal/service/CONTRACT_HANDLER";
    ServiceNames["ContractManager"] = "internal/service/CONTRACT_MANAGER";
    ServiceNames["Network"] = "internal/service/NETWORK";
    ServiceNames["RequestController"] = "internal/service/REQUEST_CONTROLLER";
    ServiceNames["RequestHandler"] = "internal/service/REQUEST_HANDLER";
    ServiceNames["SessionManager"] = "internal/service/SESSION_MANAGER";
})(ServiceNames = exports.ServiceNames || (exports.ServiceNames = {}));
