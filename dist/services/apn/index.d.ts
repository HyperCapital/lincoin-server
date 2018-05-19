import { Notification, Responses } from "apn";
import { IConfig } from "../../config";
export interface IApn {
    sendTo(recipients: string | string[], note: Notification, provider?: string): Promise<Responses>;
}
/**
 * Apn service
 */
export declare class Apn implements IApn {
    private providers;
    constructor({apn}: IConfig);
    sendTo(recipients: string | string[], note: Notification, provider?: string): Promise<Responses>;
}
