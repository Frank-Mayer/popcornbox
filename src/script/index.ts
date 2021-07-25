import ShelfView from "./View/ShelfView";
import ShelfData from "./ViewModel/ShelfViewModel";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.ts").then((registration) => {
    console.debug(registration);
  });
}

export default [
  new ShelfView(document.getElementById("recommendation")!, new ShelfData()),
];
