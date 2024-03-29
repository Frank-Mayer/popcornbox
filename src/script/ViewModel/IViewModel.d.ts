import { IModel } from "../Model/IModel";

export interface IViewModel<Data extends object, Model extends IModel<Data>> {
  [Symbol.iterator](): Generator<Data, void, unknown>;

  map<U>(
    callbackfn: (value: Data, index: number, array: Data[]) => U,
    thisArg?: any
  ): Array<U>;
}
