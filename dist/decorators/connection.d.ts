export declare function connectionController<T extends {
    new (...args: any[]): any;
}>(): (constructor: T) => {
    new (...args: any[]): any;
};
export declare function socketOpened(): (target: any, property: string) => void;
export declare function socketClosed(): (target: any, property: string) => void;
export declare function socketMessage(type: number): (target: any, property: string) => void;
