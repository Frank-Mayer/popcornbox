/// <reference path="./IView.ts" />

import { html, retriggerableDelay } from "@frank-mayer/magic";
import { imageResolver } from "../lib/TMDB";
import ShelfViewModel from "../ViewModel/ShelfViewModel";

export default class ShelfView implements IView {
  private readonly target: HTMLElement;
  private readonly vm: ShelfViewModel;
  private static readonly updateDelay = 500;

  constructor(target: HTMLElement, vm: ShelfViewModel) {
    this.target = target;
    this.vm = vm;
  }

  render(): void {
    console.count("render");
    this.target.innerHTML = this.vm
      .map((mov) => {
        return html`<li
          style="background-image: url('${imageResolver(mov.backdrop_path)}')"
        >
          <img src="${mov.cover}" loading="lazy" />
          <span>${mov.title}</span>
        </li>`[0];
      })
      .map((el) => (el ? el.outerHTML : ""))
      .join("");
  }

  notifyPropertyChanged(): void {
    retriggerableDelay(() => {
      this.render();
    }, ShelfView.updateDelay);
  }
}
