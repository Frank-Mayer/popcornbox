import { ObjectStore } from "idb";

export default interface IModel<Data extends object, ID extends keyof Data> {
  map<U>(
    callbackfn: (value: Data, index: number, array: Data[]) => U,
    thisArg?: any
  ): Array<U>;

  /**
   *  Update one value of one object in the list
   * @param id position in the list
   * @param key key inside the object to update
   * @param value new value
   */
  update<K extends keyof Data, V extends Data[K]>(
    id: any,
    key: K,
    value: V
  ): Promise<this>;

  /**
   * Update a whole object in the list
   * @param id position in the list
   * @param value new value
   */
  set(id: Data[ID], value: Data): Promise<this>;

  /**
   * Update a whole object in the local list
   * @param id position in the list
   * @param value new value
   */
  setLocal(id: Data[ID], value: Data): this;

  /**
   * Delete one item in the list
   */
  deleteLocal(id: Data[ID]): this;

  delete(id: Data[ID]): Promise<this>;

  sort(): Array<Data>;

  selfClosingIDBTransaction<R>(fun: (os: ObjectStore<Data, Data[ID]>) => R): R;
}
