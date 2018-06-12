import { injectable, inject, multiInject, optional } from "inversify";
import { ConstantNames, ServiceNames } from "../constants";

export type TInject = () => (target: any, targetKey: string, index?: number | undefined) => void;

// constants
export const injectConfig: TInject = () => inject(ConstantNames.Config);
export const injectLogger: TInject = () => inject(ConstantNames.Logger);

// services
export const injectApn: TInject = () => inject(ServiceNames.Apn);
export const injectConnectionManager: TInject = () => inject(ServiceNames.ConnectionManager);
export const injectSessionManager: TInject = () => inject(ServiceNames.SessionManager);
export const injectNetwork: TInject = () => inject(ServiceNames.Network);

export {
  injectable,
  inject,
  multiInject,
  optional,
};
