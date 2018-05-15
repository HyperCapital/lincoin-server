import { Router, Request, Response, NextFunction } from "express";
import { IRequestController } from "../services";

const metaKey = Symbol();

interface IRoute {
  method: string;
  path: string;
  property: string;
}

type TRouteDecorator = (path?: string) => (target: any, property: string) => void;

export function requestController<T extends {
  new(...args: any[]): any;
}>(path: string = null): (constructor: T) => { new(...args: any[]): any } {
  return (constructor) => {
    const target = constructor.prototype;
    return class extends constructor implements IRequestController {
      public path = path;

      public get router(): Router {
        const router: any = Router();
        const routes: IRoute[] = Reflect.getMetadata(metaKey, target) || [];
        const self: any = this;

        routes.forEach(({ method, path, property }) => {
          const action = self[ property ].bind(self);
          if (router[ method ]) {
            router[ method ](path, (req: Request, res: Response, next: NextFunction) => {
              try {
                const promise = action(req, res, next);
                if (promise instanceof Promise) {
                  promise.catch((err) => next(err));
                }
              } catch (err) {
                next(err);
              }
            });
          }
        });

        return router;
      }
    };
  };
}

function createRouteDecorator(method: string): TRouteDecorator {
  return (path = "/") => (target, property) => {
    const route: IRoute = {
      method,
      path,
      property,
    };

    Reflect.defineMetadata(metaKey, [
      ...(Reflect.getMetadata(metaKey, target) || []),
      route,
    ], target);
  };
}

export const httpAll = createRouteDecorator("all");
export const httpGet = createRouteDecorator("get");
export const httpPost = createRouteDecorator("post");
export const httpPut = createRouteDecorator("put");
export const httpDel = createRouteDecorator("delete");
