import { recover } from "secp256k1";
import { bufferToHex } from "./buffer";
import { sha3 } from "./crypto";

/**
 * converts public key to address
 * @param {Buffer} publicKey
 * @returns {string}
 */
export function publicKeyToAddress(publicKey: Buffer): string {
  return bufferToHex(
    sha3(publicKey.slice(1)).slice(-20),
    true,
  );
}

/**
 * recovers address
 * @param {Buffer} message
 * @param {Buffer} signature
 * @param {number} recovery
 * @returns {string}
 */
export function recoverAddress(message: Buffer, signature: Buffer, recovery: number): string {
  const publicKey = recover(message, signature, recovery, false);
  return publicKeyToAddress(publicKey);
}
