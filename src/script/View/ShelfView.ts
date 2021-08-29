import {
  addTrackedEventListener,
  doOnce,
  purgeTrackedElement,
  retriggerableDelay,
  simpleHash,
} from "@frank-mayer/magic";
import { imageResolver, IMovieData } from "../lib/TMDB";
import arrowLeft from "url:../../img/arrow-left.svg";
import actorImg from "url:../../img/actor.svg";
import actressImg from "url:../../img/actress.svg";
import favImg from "url:../../img/fav.svg";
import picker from "../lib/Picker";
import IModel from "../Model/IModel";
import IView from "./IView";

export default class ShelfView implements IView {
  private readonly target: HTMLElement;
  private readonly model: IModel<IMovieData, "id">;
  private static readonly updateDelay = 500;

  constructor(target: HTMLElement, model: IModel<IMovieData, "id">) {
    this.target = target;
    this.model = model;

    doOnce(() => {
      document.addEventListener(
        "scroll",
        () => {
          const liOpen = document.querySelector("li.open");
          if (liOpen) {
            this.scrollToLi(liOpen);
          }
        },
        {
          passive: true,
        }
      );
    });
  }

  private scrollToLi(el: Element) {
    const sibl = el.previousElementSibling ?? el.nextElementSibling;

    if (sibl) {
      sibl.scrollIntoView();
    }
  }

  render(): void {
    console.count("render");
    const childCountBeforeRender = this.target.childElementCount;

    const newChilds = this.model.map((mov) => {
      const li = document.createElement("li");
      li.style.backgroundImage = `linear-gradient(120deg,rgba(0,0,0,1) 0%,rgba(0,0,0,0.5) 25%,rgba(0,0,0,0.45) 50%),url("${imageResolver(
        mov.backdrop_path
      )}")`;

      addTrackedEventListener(
        li,
        "click",
        () => {
          li.classList.add("open");
        },
        {
          capture: true,
          passive: true,
        }
      );

      addTrackedEventListener(
        li,
        "contextmenu",
        (ev) => {
          ev.preventDefault();
          picker(mov.title, [
            "Löschen",
            mov.fav ? "Entfavorisieren" : "Favorisieren",
          ]).then(([i]) => {
            switch (i) {
              case 0:
                this.model.delete(mov.id).then(this.render);
                break;
              case 1:
                this.model
                  .update(mov.id, "fav", !mov.fav)
                  .then(() => {
                    li.classList.toggle("fav");
                  })
                  .catch((err) => {
                    alert(err);
                  });
            }
          });
        },
        {
          capture: false,
          passive: false,
        }
      );

      const cover = document.createElement("img");
      cover.className = "cover";
      cover.src = mov.cover;
      li.appendChild(cover);

      const title = document.createElement("span");
      title.className = "title";
      title.innerText = mov.title;
      li.appendChild(title);

      const details = document.createElement("section");
      details.className = "details";
      li.appendChild(details);

      const back = document.createElement("img");
      back.className = "back";
      back.src = arrowLeft;
      back.loading = "lazy";
      addTrackedEventListener(
        back,
        "click",
        () => {
          li.classList.remove("open");
          (li.previousElementSibling ?? li).scrollIntoView();
        },
        {
          capture: false,
          passive: true,
        }
      );
      details.appendChild(back);

      const fav = document.createElement("img");
      fav.src = favImg;
      fav.className = "fav";
      if (mov.fav) {
        li.classList.add("fav");
      }
      addTrackedEventListener(fav, "click", () => {
        this.model
          .update(mov.id, "fav", !mov.fav)
          .then(() => {
            li.classList.toggle("fav");
          })
          .catch((err) => {
            alert(err);
          });
      });
      details.appendChild(fav);

      const decrementWatchCount = document.createElement("span");
      decrementWatchCount.innerHTML = "&#x2212;";
      decrementWatchCount.className = "countButton";
      details.appendChild(decrementWatchCount);

      const watchcount = document.createElement("span");
      watchcount.className = "watchcount";
      watchcount.innerText = mov.watchcount.toString();
      addTrackedEventListener(watchcount, "change", () => {
        console.debug("change");
      });
      details.appendChild(watchcount);

      const incrementWatchCount = document.createElement("span");
      incrementWatchCount.innerHTML = "&#x002B;";
      incrementWatchCount.className = "countButton";
      details.appendChild(incrementWatchCount);

      addTrackedEventListener(decrementWatchCount, "click", () => {
        this.model
          .update(mov.id, "watchcount", --mov.watchcount)
          .then(() => {
            watchcount.innerText = mov.watchcount.toString();
          })
          .catch((err) => {
            alert(err);
          });
      });

      addTrackedEventListener(incrementWatchCount, "click", () => {
        this.model
          .update(mov.id, "watchcount", ++mov.watchcount)
          .then(() => {
            watchcount.innerText = mov.watchcount.toString();
          })
          .catch((err) => {
            alert(err);
          });
      });

      const genres = document.createElement("p");
      genres.innerText = mov.genres.join(", ");
      genres.className = "genres";
      details.appendChild(genres);

      const info = document.createElement("p");
      info.innerText = mov.info;
      info.className = "info";
      details.appendChild(info);

      if ("cast" in mov) {
        const cast = document.createElement("ul");
        cast.className = "cast";
        details.appendChild(cast);

        mov.cast
          .map((person) => {
            const castEl = document.createElement("li");

            const castImg = document.createElement("img");
            castImg.loading = "lazy";
            castImg.src =
              "profile_path" in person
                ? imageResolver(person.profile_path!, "w500")
                : person.gender == 1
                ? actressImg
                : actorImg;
            castEl.appendChild(castImg);

            const castName = document.createElement("p");
            castName.className = "actor";
            castName.innerText = person.name;
            castEl.appendChild(castName);

            const castCharacter = document.createElement("p");
            castCharacter.className = "character";
            castCharacter.innerText = person.character;
            castEl.appendChild(castCharacter);

            return castEl;
          })
          .forEach((x) => {
            cast.appendChild(x);
          });
      }

      return li;
    });

    const oldChildsToReplace = Math.min(
      childCountBeforeRender,
      newChilds.length
    );

    for (let i = 0; i < oldChildsToReplace; i++) {
      const el1 = newChilds[i]!;
      const el2 = this.target.children[i]!;
      if (simpleHash(el1.innerHTML) !== simpleHash(el2.innerHTML)) {
        console.count("el changed");
        purgeTrackedElement(el1, false);
        this.target.replaceChild(el1, el2);
      }
    }

    for (let i = oldChildsToReplace; i < childCountBeforeRender; i++) {
      console.count("el removed");
      purgeTrackedElement(this.target.lastElementChild!);
    }

    for (let i = oldChildsToReplace; i < newChilds.length; i++) {
      console.count("el added");
      this.target.appendChild(newChilds[i]!);
    }
  }

  notifyPropertyChanged(): void {
    retriggerableDelay(() => {
      this.render();
    }, ShelfView.updateDelay);
  }
}
