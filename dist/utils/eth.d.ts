/// <reference types="node" />
/**
 * converts public key to address
 * @param {Buffer} publicKey
 * @returns {string}
 */
export declare function publicKeyToAddress(publicKey: Buffer): string;
/**
 * recovers address
 * @param {Buffer} message
 * @param {Buffer} signature
 * @param {number} recovery
 * @returns {string}
 */
export declare function recoverAddress(message: Buffer, signature: Buffer, recovery: number): string;
