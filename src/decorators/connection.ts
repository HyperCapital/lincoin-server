import {
  IConnectionEventHandler,
  IConnectionController,
  ConnectionEventHandlerTypes,
} from "../services";

const metaKey = Symbol();

export function connectionController<T extends {
  new(...args: any[]): any;
}>(): (constructor: T) => { new(...args: any[]): any } {
  return (constructor) => {
    const target = constructor.prototype;
    return class extends constructor implements IConnectionController {
      public get eventHandlers() {
        const eventHandlers: IConnectionEventHandler[] = Reflect.getMetadata(metaKey, target) || [];
        const self: any = this;
        return eventHandlers.map((eventHandler) => {
          const handler = self[ eventHandler.property ].bind(self);
          return {
            ...eventHandler,
            handler,
          };
        });
      }
    };
  };
}

function addEventHandler(target: any, eventHandler: IConnectionEventHandler): void {
  Reflect.defineMetadata(metaKey, [
    ...(Reflect.getMetadata(metaKey, target) || []),
    eventHandler,
  ], target);
}

export function socketOpened(): (target: any, property: string) => void {
  return (target, property) => {
    addEventHandler(target, {
      type: ConnectionEventHandlerTypes.Opened,
      property,
    });
  };
}

export function socketClosed(): (target: any, property: string) => void {
  return (target, property) => {
    addEventHandler(target, {
      type: ConnectionEventHandlerTypes.Closed,
      property,
    });
  };
}

export function socketMessage(type: number): (target: any, property: string) => void {
  return (target, property) => {
    addEventHandler(target, {
      type: ConnectionEventHandlerTypes.Message,
      property,
      params: {
        type,
      },
    });
  };
}