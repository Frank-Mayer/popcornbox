/// <reference path="./IView.ts" />

import { html } from "@frank-mayer/magic";
import ShelfData from "../ViewModel/ShelfViewModel";

export default class ShelfView implements IView<ShelfData> {
  target: HTMLElement;
  data: ShelfData;

  constructor(target: HTMLElement, data: ShelfData) {
    this.target = target;
    this.data = data;
  }

  render(): void {
    this.target.innerHTML = this.data
      .map((mov) => html`<li>${mov.title}</li>`[0])
      .map((el) => el.outerHTML)
      .join("");
  }
}
