export type KeyType = string | number;

export type ObjType = {
  [prop: KeyType]: any;
};

export type FunType = (...args: any[]) => any;

export type ExcludeAny<T, U> = T extends U ? any : T;
// 去除interface中某些属性
export type ExcludeInterface<T, E> = {
  [P in ExcludeAny<keyof T, E>]: T[P];
};

export const enum NumberBoolean {
  FALSE,
  TRUE,
}

// 状态
export const enum StatusType {
  OFFLINE,
  ONLINE,
}

// 类型列表
export type ColorType = "default" | "success" | "warning" | "info" | "error" | "primary";
export type TypeItem = {
  text: string;
  value: number | undefined;
  color?: ColorType;
};
