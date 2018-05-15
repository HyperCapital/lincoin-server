export interface IContractEventHandler<T = any> {
    type: string;
    property: string;
    handler?: (...args: any[]) => Promise<void> | void;
}
export interface IContractController {
    contract: string;
    eventHandlers: IContractEventHandler[];
}
