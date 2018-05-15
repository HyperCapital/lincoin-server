declare module "secp256k1/elliptic" {
  export function ecdh(publicKey: Buffer, privateKey: Buffer): Buffer;
  export function publicKeyCreate(privateKey: Buffer, compressed?: boolean): Buffer;
  export function publicKeyConvert(publicKey: Buffer, compressed?: boolean): Buffer;
  export function loadPublicKey(publicKey: Buffer): Buffer;
}
