import {
  addTrackedEventListener,
  purgeTrackedElement,
} from "@frank-mayer/magic";

export default function picker(
  caption: string,
  values: Array<string>
): Promise<[number, string | null]> {
  return new Promise((resolve) => {
    const dialogBack = document.createElement("div");
    dialogBack.className = "modal";
    addTrackedEventListener(dialogBack, "click", (ev) => {
      if (ev.target === dialogBack) {
        resolve([-1, null]);
        purgeTrackedElement(dialogBack);
      }
    });

    const pickerView = document.createElement("div");
    pickerView.className = "picker";
    dialogBack.appendChild(pickerView);

    const caltionEl = document.createElement("span");
    caltionEl.innerText = caption;
    caltionEl.className = "caption";
    pickerView.appendChild(caltionEl);

    values.forEach((value, i) => {
      const li = document.createElement("span");
      li.className = "el";
      li.innerText = value;
      addTrackedEventListener(
        li,
        "click",
        () => {
          resolve([i, value]);
          purgeTrackedElement(dialogBack);
        },
        {
          capture: false,
          once: true,
          passive: true,
        }
      );
      pickerView.appendChild(li);
    });

    const cancel = document.createElement("span");
    cancel.className = "el";
    cancel.innerText = "Abbrechen";
    addTrackedEventListener(
      cancel,
      "click",
      () => {
        resolve([-1, null]);
        purgeTrackedElement(dialogBack);
      },
      {
        capture: false,
        once: true,
        passive: true,
      }
    );
    pickerView.appendChild(cancel);

    document.body.appendChild(dialogBack);
  });
}
