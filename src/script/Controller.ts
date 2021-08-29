import { purgeTrackedElement } from "@frank-mayer/magic";
import firebase from "firebase";
import "firebase/auth";
import "firebase/database";
import { DB, openDb } from "idb";
import { IMovieData } from "./lib/TMDB";
import login from "./login";
import IModel from "./Model/IModel";
import ShelfModel from "./Model/ShelfModel";
import ShelfModelOffline from "./Model/ShelfModelOffline";
import IView from "./View/IView";
import ShelfView from "./View/ShelfView";

export default class Controller {
  app: firebase.app.App;
  auth: firebase.auth.Auth;
  shelfModel!: IModel<IMovieData, "id">;
  shelfView!: IView;
  offlineDb: any;

  constructor(fbData: object) {
    try {
      if (!("BigInt" in globalThis)) {
        this.oldBrowser();
      }
    } catch {
      this.oldBrowser();
    }

    // Login and sw registration:
    this.app = firebase.initializeApp(fbData);

    this.auth = this.app.auth();

    this.auth.onAuthStateChanged((ev) => this.onAuthStateChanged(ev));
  }

  oldBrowser() {
    const msg =
      "Falls Du hinter'm Mond lebst: Dein Browser ist veraltet!\nBitte update auf den neuesten Stand der Technik, wir sind nicht mehr in der Steinzeit.";
    alert(msg);
    throw msg;
  }

  async onAuthStateChanged(ev: firebase.User | null): Promise<void> {
    await (ev ? this.onLoggedIn(ev) : this.onLoggedOut());
  }

  async onLoggedIn(ev: firebase.User) {
    {
      const loginEl = document.getElementById("login");
      if (loginEl) {
        purgeTrackedElement(loginEl);
      }

      const username = ev.email!.split("@")[0]!;

      const db = this.app.database().ref(`/users/${username}/`);

      const dbShelf = db.child("shelf");

      this.offlineDb = await this.getOfflineDB();

      this.shelfModel = navigator.onLine
        ? new ShelfModel(dbShelf, this.offlineDb)
        : new ShelfModelOffline(this.offlineDb);

      this.shelfView = new ShelfView(
        document.getElementById("shelf")!,
        this.shelfModel
      );

      dbShelf.on("child_added", (ds) => this.onChildAdded(ds));

      dbShelf.on("child_changed", (ds) => this.onChildChanged(ds));

      dbShelf.on("child_removed", (ds) => this.onChildRemoved(ds));
    }
  }

  async onLoggedOut() {
    const loginInfo = await login();
    this.auth.setPersistence(loginInfo.save ? "local" : "none");
    this.auth.signInWithEmailAndPassword(...loginInfo.data);
  }

  onChildAdded(ds: firebase.database.DataSnapshot) {
    const key = ds.key;
    if (key) {
      this.shelfModel.setLocal(Number(key), ds.val());
      this.shelfView.notifyPropertyChanged();
    }
  }

  onChildChanged(ds: firebase.database.DataSnapshot) {
    const key = ds.key;
    if (key) {
      this.shelfModel.setLocal(Number(key), ds.val());
      this.shelfView.notifyPropertyChanged();
    }
  }

  onChildRemoved(ds: firebase.database.DataSnapshot) {
    const key = ds.key;
    if (key) {
      this.shelfModel.deleteLocal(Number(key));
      this.shelfView.notifyPropertyChanged();
    }
  }

  getOfflineDB(): Promise<DB> {
    return openDb("PopcornBox", 1, (db) => {
      switch (db.oldVersion) {
        case 0:
          // Create an objectStore for this database
          const os = db.createObjectStore<IMovieData, IMovieData["id"]>(
            "shelf",
            {
              autoIncrement: false,
              keyPath: "id",
            }
          );

          // define what data items the objectStore will contain
          os.createIndex("adult", "adult", { unique: false });
          os.createIndex("backdrop_path", "backdrop_path", { unique: false });
          os.createIndex("cast", "cast", { unique: false });
          os.createIndex("cover", "cover", { unique: false });
          os.createIndex("date", "date", { unique: false });
          os.createIndex("fav", "fav", { unique: false });
          os.createIndex("genres", "genres", { unique: false });
          os.createIndex("id", "id", { unique: true });
          os.createIndex("info", "info", { unique: false });
          os.createIndex("mediaType", "mediaType", { unique: false });
          os.createIndex("original", "original", { unique: false });
          os.createIndex("rating", "rating", { unique: false });
          os.createIndex("status", "status", { unique: false });
          os.createIndex("title", "title", { unique: false });
          os.createIndex("typ", "typ", { unique: false });
          os.createIndex("watchcount", "watchcount", { unique: false });
      }
    });
  }
}
