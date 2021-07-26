import { html } from "@frank-mayer/magic";

export function login(): Promise<{ save: boolean; data: [string, string] }> {
  return new Promise((resolve, reject) => {
    const form = document.body.appendChild(
      html`<form id="login">
        <input
          type="text"
          placeholder="Nutzername"
          autocomplete="username"
          required
        />
        <input
          type="password"
          placeholder="Passwort"
          autocomplete="current-password"
          required
        />
        <input type="checkbox" checked="checked" name="remember" />
        <button type="submit">Anmelden</button>
      </form>`[0]!
    ) as HTMLFormElement;

    form.addEventListener(
      "submit",
      (ev) => {
        ev.preventDefault();
        const usr = (form.querySelector("input[type=text]") as HTMLInputElement)
          .value;
        if (!usr) {
          reject("Bitte Nutzername angeben");
          return false;
        }

        const pwd = (
          form.querySelector("input[type=password]") as HTMLInputElement
        ).value;
        if (!pwd) {
          reject("Bitte Passwort angeben");
          return false;
        }

        const save = (form.querySelector("input[checked]") as HTMLInputElement)
          .checked;
        resolve({
          save,
          data: [`${usr}@popcornbox.web.app`, pwd],
        });
        return false;
      },
      {
        passive: false,
      }
    );
  });
}
