import ShelfView from "./View/ShelfView";
import ShelfData from "./ViewModel/ShelfViewModel";

const sw = new Worker("./sw.ts");

export default [
  new ShelfView(document.getElementById("recommendation")!, new ShelfData()),
];
