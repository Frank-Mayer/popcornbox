import { IMovieData } from "../lib/TMDB";
import { IModel } from "./IModel";

export class ShelfModel implements IModel<IMovieData> {
  private readonly data: Map<string, IMovieData>;

  constructor() {
    this.data = new Map();
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

  set(key: string, value: IMovieData): this {
    this.data.set(key, value);
    return this;
  }

  remove(key: string): this {
    this.data.delete(key);
    return this;
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
}
