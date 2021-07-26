/// <reference path="./IViewModel.d.ts" />

import { IMovieData } from "../lib/TMDB";
import { ShelfModel } from "../Model/ShelfModel";
import { IViewModel } from "./IViewModel";

export default class ShelfViewModel
  implements IViewModel<IMovieData, ShelfModel>
{
  private readonly model: ShelfModel;

  constructor(model: ShelfModel) {
    this.model = model;
  }

  map<U>(
    callbackfn: (value: IMovieData, index: number, array: IMovieData[]) => U,
    thisArg?: any
  ): U[] {
    return this.model.map(callbackfn, thisArg);
  }

  *[Symbol.iterator](): Generator<IMovieData, void, unknown> {
    for (const el of this.model) {
      yield el;
    }
  }
}
