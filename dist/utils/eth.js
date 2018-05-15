"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const buffer_1 = require("./buffer");
const crypto_1 = require("./crypto");
/**
 * converts public key to address
 * @param {Buffer} publicKey
 * @returns {string}
 */
function publicKeyToAddress(publicKey) {
    return buffer_1.bufferToHex(crypto_1.sha3(publicKey.slice(1)).slice(-20), true);
}
exports.publicKeyToAddress = publicKeyToAddress;
