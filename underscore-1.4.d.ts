// Type definitions for Underscore 1.4.1
// https://github.com/borisyankov/DefinitelyTyped

interface UnderscoreWrappedObject {
    value () : any;
}

interface TemplateSettings {
    evaluate?: RegExp;
    interpolate?: RegExp;
    escape?: RegExp;
}

interface ListIterator {
    (value, key, list?): void;
}

interface ObjectIterator {
    (element, index, list?): void;
}

interface UnderscoreStatic {

    /****
     Collections
    *****/
    each(list: any[], iterator: ListIterator, context?: any): any[];
    each(object: any, iterator: ObjectIterator, context?: any): any[];
    forEach(list: any[], iterator: ObjectIterator, context?: any): any[];
    forEach(object: any, iterator: ListIterator, context?: any): any[];

    map(list: any[], iterator: ListIterator, context?: any): any[];
    map(object: any, iterator: ObjectIterator, context?: any): any[];
    collect(list: any[], iterator: ListIterator, context?: any): any[];
    collect(object: any, iterator: ObjectIterator, context?: any): any[];

    reduce(list: any[], iterator: any, memo: any, context?: any): any[];
    inject(list: any[], iterator: any, memo: any, context?: any): any[];
    foldl(list: any[], iterator: any, memo: any, context?: any): any[];

    reduceRight(list: any[], iterator: any, memo: any, context?: any): any[];
    foldr(list: any[], iterator: any, memo: any, context?: any): any[];

    find(list: any[], iterator: any, context?: any): any;
    detect(list: any[], iterator: any, context?: any): any;

    filter(list: any[], iterator: any, context?: any): any[];
    select(list: any[], iterator: any, context?: any): any[];

    where(list: any[], properties: any): any[];

    reject(list: any[], iterator: any, context?: any): any[];

    all(list: any[], iterator: any, context?: any):boolean;
    every(list: any[], iterator: any, context?: any): boolean;

    any(list: any[], iterator?: any, context?: any): boolean;
    some(list: any[], iterator?: any, context?: any): boolean;

    contains(list: any, value: any): boolean;
    contains(list: any[], value: any): boolean;
    include(list: any, value: any): boolean;
    include(list: any[], value: any): boolean;

    invoke(list: any[], methodName: string, arguments: any[]): any;
    invoke(object: any, methodName: string, ...arguments: any[]): any;

    pluck(list: any[], propertyName: string): string[];
    max(list: any[], iterator?: any, context?: any): any;
    min(list: any[], iterator?: any, context?: any): any;
    sortBy(list: any[], iterator?: any, context?: any): any;
    groupBy(list: any[], iterator: any): any;
    countBy(list: any[], iterator: any): any;
    shuffle(list: any[]): any[];
    toArray(list: any): any[];
    size(list: any): number;

    /****
     Arrays
    *****/
    first(array: any[], n?: number): any;
    head(array: any[], n?: number): any;
    take(array: any[], n?: number): any;

    initial(array: any[], n?: number): any[];

    last(array: any[], n?: number): any;

    rest(array: any[], n?: number): any[];
    tail(array: any[], n?: number): any[];
    drop(array: any[], n?: number): any[];

    compact(array: any[]): any[];
    flatten(array: any[], shallow?: boolean): any[];
    without(array: any[], ...values: any[]): any[];
    union(...arrays: any[][]): any[];
    intersection(...arrays: any[][]): any[];
    difference(array: any[], ...others: any[][]): any[];

    uniq(array: any[], isSorted?: boolean, iterator?: any): any[];
    unique(array: any[], isSorted?: boolean, iterator?: any): any[];

    zip(...arrays: any[]): any[];
    object(list: any[], values: any[]): any;
    indexOf(array: any[], value: any, isSorted?: boolean): number;
    lastIndexOf(array: any[], value: any, fromIndex?: number): number;
    sortedIndex(list: any[], valueL: any, iterator?: any): number;
    range(stop: number): any[];
    range(start: number, stop: number, step?: number): any[];

    /****
     Functions
    *****/
    bind(func: (...as : any[]) => any, context: any, ...arguments: any[]): () => any;
    bindAll(object: any, ...methodNames: string[]): any;
    memoize(func: any, hashFunction?: any): any;
    defer(func: () => any);
    delay(func: any, wait: number, ...arguments: any[]): any;
    delay(func: any, ...arguments: any[]): any;
    throttle(func: any, wait: number): any;
    debounce(func: any, wait: number, immediate?: boolean): any;
    once(func: any): any;
    after(count: number, func: any): any;
    wrap(func: (...as : any[]) => any, wrapper: any): () => any;
    compose(...functions: any[]): any;

    /****
     Objects
    *****/
    keys(object: any): any[];
    values(object: any): any[];
    pairs(object: any): any[];
    invert(object: any): any;

    functions(object: any): string[];
    methods(object: any): string[];

    extend(destination: any, ...sources: any[]): any;
    pick(object: any, ...keys: string[]): any;
    omit(object: any, ...keys: string[]): any;
    defaults(object: any, ...defaults: any[]): any;
    clone(object: any): any;
    tap(object: any, interceptor: (...as : any[]) => any): any;
    has(object: any, key: string): boolean;
    isEqual(object: any, other: any): boolean;
    isEmpty(object: any): boolean;
    isElement(object: any): boolean;
    isArray(object: any): boolean;
    isObject(value: any): boolean;
    isArguments(object: any): boolean;
    isFunction(object: any): boolean;
    isString(object: any): boolean;
    isNumber(object: any): boolean;
    isFinite(object: any): boolean;
    isBoolean(object: any): boolean;
    isDate(object: any): boolean;
    isRegExp(object: any): boolean;
    isNaN(object: any): boolean;
    isNull(object: any): boolean;
    isUndefined(value: any): boolean;

    /****
     Utility
    *****/
    noConflict(): any;
    identity(value: any): any;
    times(n: number, iterator: (index : number) => void, context?: any): void;
    random(min: number, max: number): number;
    mixin(object: any): void;
    uniqueId(prefix: string): string;
    uniqueId(): number;
    escape(str: string): string;
    result(object: any, property: string): any;
    templateSettings: TemplateSettings;
    template(templateString: string, data?: any, settings?: any): (...data: any[]) => string;

    /****
     Chaining
    *****/
    chain(object: any): UnderscoreWrappedObject;
}

declare var _: UnderscoreStatic;