import { addTrackedEventListener } from "@frank-mayer/magic";

export default function login(): Promise<{
  save: boolean;
  data: [string, string];
}> {
  return new Promise((resolve, reject) => {
    const form = document.createElement("form");
    form.id = "login";

    const usrerInput = document.createElement("input");
    usrerInput.type = "text";
    usrerInput.placeholder = "Nutzername";
    usrerInput.autocomplete = "username";
    usrerInput.required = true;
    form.appendChild(usrerInput);

    const passwordInput = document.createElement("input");
    passwordInput.type = "password";
    passwordInput.placeholder = "Passwort";
    passwordInput.autocomplete = "current-password";
    passwordInput.required = true;
    form.appendChild(passwordInput);

    const rememberLabel = document.createElement("label");
    rememberLabel.setAttribute("for", "remember");
    form.appendChild(rememberLabel);

    const rememberCheckbox = document.createElement("input");
    rememberCheckbox.type = "checkbox";
    rememberCheckbox.checked = true;
    rememberCheckbox.id = "remember";
    rememberCheckbox.name = "remember";
    rememberLabel.appendChild(rememberCheckbox);

    rememberLabel.innerHTML += "Angemeldet bleiben";

    const submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.innerText = "Anmelden";
    form.appendChild(submitBtn);

    document.body.appendChild(form);

    addTrackedEventListener(
      form,
      "submit",
      (ev) => {
        ev.preventDefault();
        const usr = usrerInput.value;
        if (!usr) {
          reject("Bitte Nutzername angeben");
          return false;
        }

        const pwd = passwordInput.value;
        if (!pwd) {
          reject("Bitte Passwort angeben");
          return false;
        }

        resolve({
          save: rememberCheckbox.checked,
          data: [`${usr}@popcornbox.web.app`, pwd],
        });
        return false;
      },
      {
        passive: false,
        once: true,
      }
    );
  });
}
