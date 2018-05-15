import * as createKeccakHash from "keccak";

/**
 * creates sha3
 * @param {Buffer} data
 * @return {Buffer}
 */
export function sha3(...data: Buffer[]): Buffer {
  return createKeccakHash("keccak256")
    .update(Buffer.concat(data))
    .digest();
}
