export declare function requestController<T extends {
    new (...args: any[]): any;
}>(path?: string): (constructor: T) => {
    new (...args: any[]): any;
};
export declare const httpAll: (path?: string) => (target: any, property: string) => void;
export declare const httpGet: (path?: string) => (target: any, property: string) => void;
export declare const httpPost: (path?: string) => (target: any, property: string) => void;
export declare const httpPut: (path?: string) => (target: any, property: string) => void;
export declare const httpDel: (path?: string) => (target: any, property: string) => void;
