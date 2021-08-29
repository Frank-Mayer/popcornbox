import { retriggerableDelay } from "@frank-mayer/magic";
import firebase from "firebase";
import "firebase/database";
import { DB, ObjectStore, Transaction } from "idb";
import { IMovieData } from "../lib/TMDB";
import IModel from "./IModel";

type ID = IMovieData["id"];

export default class ShelfModel implements IModel<IMovieData, "id"> {
  private readonly data: Map<ID, IMovieData>;
  private readonly db: firebase.database.Reference;
  private readonly offlineDb: DB;
  private tx: Transaction | null;

  constructor(database: firebase.database.Reference, offlineDatabase: DB) {
    this.data = new Map();
    this.db = database;
    this.offlineDb = offlineDatabase;
    this.tx = null;
  }

  *[Symbol.iterator](): Generator<IMovieData, void, unknown> {
    this.sort();
    for (const el of this.data) {
      yield el[1];
    }
  }

  map<U>(
    callbackfn: (value: IMovieData, index: number, array: IMovieData[]) => U,
    thisArg?: any
  ): U[] {
    return this.sort().map(callbackfn, thisArg);
  }

  async update<K extends keyof IMovieData, V extends IMovieData[K]>(
    id: ID,
    key: K,
    value: V
  ): Promise<this> {
    await this.db.child(`${id}/${key}`).set(value);
    return this;
  }

  async set(id: ID, value: IMovieData | null): Promise<this> {
    await this.db.child(id.toString()).set(value);
    return this;
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

  delete(id: ID): Promise<this> {
    return new Promise((resolve, reject) => {
      this.deleteLocal(id);
      this.db
        .child(id.toString())
        .remove()
        .then(() => {
          resolve(this);
        })
        .catch(reject);
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

  selfClosingIDBTransaction<R>(fun: (os: ObjectStore<IMovieData, ID>) => R): R {
    this.tx ??= this.offlineDb.transaction("shelf", "readwrite");
    const r = fun(this.tx.objectStore(this.tx.objectStoreNames[0]!));
    retriggerableDelay(() => {
      this.tx?.complete;
      this.tx = null;
      console.count("idb transaction");
    }, 200);
    return r;
  }
}
