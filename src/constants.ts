export const DEFAULT_ID = "default";

export enum ConstantNames {
  Config = "internal/constant/CONFIG",
  Logger = "internal/constant/LOGGER",
  HttpServer = "internal/constant/HTTP_SERVER",
  WsServer = "internal/constant/WS_SERVER",
}

export enum ServiceNames {
  Apn = "internal/service/APN",
  ConnectionController = "internal/service/CONNECTION_CONTROLLER",
  ConnectionHandler = "internal/service/CONNECTION_HANDLER",
  ConnectionManager = "internal/service/CONNECTION_MANAGER",
  ContractController = "internal/service/CONTRACT_CONTROLLER",
  ContractHandler = "internal/service/CONTRACT_HANDLER",
  ContractManager = "internal/service/CONTRACT_MANAGER",
  Network = "internal/service/NETWORK",
  RequestController = "internal/service/REQUEST_CONTROLLER",
  RequestHandler = "internal/service/REQUEST_HANDLER",
  SessionManager = "internal/service/SESSION_MANAGER",
}
