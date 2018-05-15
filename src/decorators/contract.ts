import {
  IContractEventHandler,
  IContractController,
} from "../services";

const metaKey = Symbol();

export function contractController<T extends {
  new(...args: any[]): any;
}>(contract: string = ""): (constructor: T) => { new(...args: any[]): any } {
  return (constructor) => {
    const target = constructor.prototype;
    return class extends constructor implements IContractController {
      public contract = contract;

      public get eventHandlers() {
        const eventHandlers: IContractEventHandler[] = Reflect.getMetadata(metaKey, target) || [];
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

export function contractEvent(type: string): (target: any, property: string) => void {
  return (target, property) => {
    Reflect.defineMetadata(metaKey, [
      ...(Reflect.getMetadata(metaKey, target) || []), {
        type,
        property,
      },
    ], target);
  };
}
