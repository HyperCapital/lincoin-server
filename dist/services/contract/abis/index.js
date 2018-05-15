"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const p2pChannelFactory_1 = require("./p2pChannelFactory");
exports.default = {
    [constants_1.ContractTypes.P2PChannelFactory]: p2pChannelFactory_1.default,
};
