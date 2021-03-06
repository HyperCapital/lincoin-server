import { Hash } from "crypto";

declare module "keccak" {
  type Types = "keccak256" | "keccak512";
  const keccak: (type: Types) => Hash;
  export = keccak;
}
