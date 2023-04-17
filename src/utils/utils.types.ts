type ObjectToObjectsByKey<T extends {[s: string]: any}> = {[Key in keyof T]: { field: Key, value: T[Key] }};

export type ObjectToUnion<T extends {[s: string]: any}> = T[keyof T];

export type ObjectToValueUnion<T extends {[s: string]: any}> = ObjectToUnion<T>;

/**
 * map from object to uniom by template <T extends {[key]: type}> => { field: key1, value: T[key1] } | { field: key2, value: T[key2] } | ...
 */
export type ObjectToFieldsChanger<T extends {[s: string]: any}> = ObjectToUnion<ObjectToObjectsByKey<T>>;

export type DeepRequired<T> = {
    [Key in keyof T]-?: T[Key] extends object 
        ? NonNullable<DeepRequired<T[Key]>> 
        : T[Key] extends object | null
        ? NonNullable<DeepRequired<T[Key]>> 
        : T[Key] extends object | null | undefined
        ? NonNullable<DeepRequired<T[Key]>> 
        : NonNullable<T[Key]>
};

export type DeepPartial<T> = Partial<{
    [Key in keyof T]: T[Key] extends object 
        ? DeepPartial<T[Key]>
        : T[Key] extends object | null
        ? DeepPartial<T[Key]> | null
        : T[Key] extends object | null | undefined
        ? DeepPartial<T[Key]> | null | undefined
        : T[Key]
}>;

export type ReverseMap<T extends Record<keyof T, keyof any>> = {
    [P in T[keyof T]]: {
        [K in keyof T]: T[K] extends P ? K : never
    }[keyof T]
}

export type Keyof<Obj extends Object> = keyof Obj;

export type ValuesUnion<D> = D extends Object ? D[keyof D] :
    D extends Array<any> ? D[number] : D;

export type Nullable<D> = D | null | undefined;

/**
 * make all obejct or array params NonNullable
 */
export type NonNullableParams<T> = T extends Array<any>
    ? NonNullable<T[number]>[]
    : T extends Object
    ? { [Key in keyof T]-?: NonNullable<T[Key]> }
    : T

export type NonNullableObject<D extends {[ key: string ]: any}, K extends keyof D> = {[Key in keyof D]: Key extends K ? NonNullable<D[Key]> : boolean};

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type RequiredKeys<T, K extends keyof T> = T & { [Key in K]: NonNullable<T[K]> };

export type ExtractByParam<T, Key extends keyof T, Value extends T[Key]> = Extract<T, { [type in Key]: Value }>;

export type ExtractDataByParam<T, Key extends keyof T, Value extends T[Key], Param extends keyof ExtractByParam<T, Key, Value>> = Extract<T, { [type in Key]: Value }>[Param];