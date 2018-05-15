export declare function contractController<T extends {
    new (...args: any[]): any;
}>(contract?: string): (constructor: T) => {
    new (...args: any[]): any;
};
export declare function contractEvent(type: string): (target: any, property: string) => void;
