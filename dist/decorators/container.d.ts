import { injectable, inject, multiInject, optional } from "inversify";
export declare type TInject = () => (target: any, targetKey: string, index?: number | undefined) => void;
export declare const injectConfig: TInject;
export declare const injectLogger: TInject;
export declare const injectApn: TInject;
export declare const injectConnectionManager: TInject;
export declare const injectSessionManager: TInject;
export { injectable, inject, multiInject, optional };
