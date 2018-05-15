"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createKeccakHash = require("keccak");
/**
 * creates sha3
 * @param {Buffer} data
 * @return {Buffer}
 */
function sha3(...data) {
    return createKeccakHash("keccak256")
        .update(Buffer.concat(data))
        .digest();
}
exports.sha3 = sha3;
