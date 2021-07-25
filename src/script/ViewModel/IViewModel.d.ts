interface IViewModel<T> {
  readonly buffer: Array<T>;

  [Symbol.iterator](): Generator<T, void, unknown>;

  map<U>(
    callbackfn: (value: T, index: number, array: T[]) => U,
    thisArg?: any
  ): Array<U>;
}
