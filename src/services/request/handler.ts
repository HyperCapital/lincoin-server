import { Server } from "http";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as statuses from "statuses";
import { LoggerInstance } from "winston";
import { inject, injectable, multiInject, optional } from "inversify";
import { ConstantNames, ServiceNames } from "../../constants";
import { prepareHex } from "../../utils";
import { ISessionManager, ISession } from "../session";
import { IRequestController, IHttpRequest, IHttpResponse } from "./interfaces";

/**
 * Request handler service
 */
@injectable()
export class RequestHandler {

  constructor(
    @inject(ConstantNames.HttpServer) httpServer: Server,
    @inject(ConstantNames.Logger) protected logger: LoggerInstance,
    @inject(ServiceNames.SessionManager) @optional() protected sessionManager: ISessionManager,
    @multiInject(ServiceNames.RequestController) @optional() protected controllers: IRequestController[],
  ) {
    const app = express()
      .enable("trust proxy")
      .disable("x-powered-by");

    app
      .use(bodyParser.json({
        reviver: (key: any, value: any) => {
          if (value && typeof value === "object") {
            switch (value.type) {
              case "Buffer":
                value = Buffer.from(value.data);
                break;
            }
          }
          return value;
        },
      }))
      .use(this.middleware.bind(this))
      .use(this.router)
      .use(this.status404Handler.bind(this))
      .use(this.status500Handler.bind(this));

    httpServer.on("request", app);
  }

  private get router(): express.Router {
    const result = express.Router();

    try {
      for (const controller of this.controllers) {
        const { path, router } = controller;
        if (!path) {
          result.use(router);
        } else {
          result.use(path, router);
        }
      }
    } catch (err) {
      this.logger.error("request:handler", err);
    }

    return result;
  }

  private middleware(req: IHttpRequest, res: IHttpResponse, next: express.NextFunction) {
    Object.assign(req, {
      authenticate: (sendError: boolean = true) => {
        let result: ISession = null;
        const hash = req.headers.authorization;
        if (hash && this.sessionManager) {
          const session = this.sessionManager.getHashSession(prepareHex(hash));

          if (session && session.address) {
            result = session;
          }
        }

        if (!result && sendError) {
          res.sendError(403);
        }

        return result;
      },
    });

    Object.assign(res, {
      sendError: (code: number, data?: any) => {
        const body: any = {
          error: statuses[ code ],
        };

        if (data) {
          switch (typeof data) {
            case "string":
              body.error = data;
              break;
            case "object":
              Object.assign(body, data);
              break;
          }
        }

        res.status(code);
        res.send(body);
      },
    });

    next();
  }

  private status404Handler(req: IHttpRequest, res: IHttpResponse) {
    res.sendError(404);

    const { method, url, query, params } = req;

    this.logger.debug("request:handler:404", {
      method,
      url,
      query,
      params,
    });
  }

  private status500Handler(err: any, req: IHttpRequest, res: IHttpResponse, next: express.NextFunction) {
    res.sendError(500);

    this.logger.error("request:handler:500", err);
  }
}
