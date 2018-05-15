import { injectable, inject } from "inversify";
import { ConstantNames } from "../../constants";
import { IConfig } from "../../config";

/**
 * Apn service
 */
@injectable()
export class Apn {
  constructor(@inject(ConstantNames.Config) private config: IConfig) {
    console.log("apn:constructor");
  }
}
