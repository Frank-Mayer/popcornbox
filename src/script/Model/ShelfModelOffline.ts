import { IMovieData } from "../lib/TMDB";
import IModel from "./IModel";
import { DB, ObjectStore, Transaction } from "idb";
import { retriggerableDelay } from "@frank-mayer/magic";

export default class ShelfModelOffline<ID extends IMovieData["id"]>
  implements IModel<IMovieData, "id">
{
  private readonly data: Map<ID, IMovieData>;
  private readonly db: DB;
  private tx: Transaction | null = null;

  constructor(db: DB) {
    this.data = new Map();
    this.db = db;
  }

  map<U>(
    callbackfn: (value: IMovieData, index: number, array: IMovieData[]) => U,
    thisArg?: any
  ): U[] {
    return this.sort().map(callbackfn, thisArg);
  }

  update<K extends keyof IMovieData, V extends IMovieData[K]>(
    _id: any,
    _key: K,
    _value: V
  ): Promise<this> {
    return new Promise((resolve) => {
      alert("Diese Funktion is offline nicht verfügbar");
      resolve(this);
    });
  }

  set(_id: ID, _value: IMovieData): Promise<this> {
    return new Promise((resolve) => {
      alert("Diese Funktion is offline nicht verfügbar");
      resolve(this);
    });
  }

  setLocal(id: ID, value: IMovieData): this {
    this.data.set(id, value);
    this.selfClosingIDBTransaction((os) => {
      os.put(value);
    });
    return this;
  }

  deleteLocal(id: ID): this {
    this.data.delete(id);
    this.selfClosingIDBTransaction((os) => {
      os.delete(id);
    });
    return this;
  }

  delete(_id: ID): Promise<this> {
    return new Promise((resolve) => {
      alert("Diese Funktion is offline nicht verfügbar");
      resolve(this);
    });
  }

  private sortCompare(a: IMovieData, b: IMovieData): number {
    if (a.title < b.title) {
      return -1;
    } else if (a.title > b.title) {
      return 1;
    } else {
      return 0;
    }
  }

  sort(): Array<IMovieData> {
    return Array.from(this.data.values()).sort(this.sortCompare);
  }

  selfClosingIDBTransaction<R>(
    fun: (os: ObjectStore<IMovieData, IMovieData["id"]>) => R
  ): R {
    this.tx ??= this.db.transaction("shelf", "readwrite");
    const r = fun(this.tx.objectStore(this.tx.objectStoreNames[0]!));
    retriggerableDelay(() => {
      this.tx?.complete;
      this.tx = null;
      console.count("idb transaction");
    }, 200);
    return r;
  }
}
