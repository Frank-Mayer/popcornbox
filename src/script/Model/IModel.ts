export interface IModel<Data extends object> {
  [Symbol.iterator](): Generator<Data, void, unknown>;

  map<U>(
    callbackfn: (value: Data, index: number, array: Data[]) => U,
    thisArg?: any
  ): Array<U>;

  set(key: string, value: Data): this;

  remove(key: string): this;
}
