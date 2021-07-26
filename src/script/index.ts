import firebase from "firebase";
import "firebase/auth";
import "firebase/database";
import { login } from "./login";
import { ShelfModel } from "./Model/ShelfModel";
import ShelfView from "./View/ShelfView";
import ShelfViewModel from "./ViewModel/ShelfViewModel";

const broadcast = new BroadcastChannel("sw-channel");

broadcast.onmessage = (event) => {
  console.log(event.data);
};

// Login and sw registration:
const app = firebase.initializeApp({
  apiKey: "AIzaSyCst5h8aS2CSygx8g7T7jaqUOwQikgLLn4",
  appId: "1:966856612463:web:60aa0377fffad494af8b9a",
  authDomain: "popcorn-box-app.firebaseapp.com",
  databaseURL: "https://popcorn-box-app.firebaseio.com",
  messagingSenderId: "966856612463",
  projectId: "popcorn-box-app",
  storageBucket: "popcorn-box-app.appspot.com",
});

const auth = app.auth();

auth.onAuthStateChanged(async (ev) => {
  if (!ev) {
    location.reload();
    return;
  }

  const username = ev.email!.split("@")[0]!;

  const db = app.database().ref(`/users/${username}/`);

  const login = document.getElementById("login");
  if (login) {
    login.remove();
  }

  const shelfModel = new ShelfModel();
  const shelfViewModel = new ShelfViewModel(shelfModel);
  const shelfView = new ShelfView(
    document.getElementById("recommendation")!,
    shelfViewModel
  );

  const dbShelf = db.child("shelf");

  dbShelf.on("child_added", (ds) => {
    const key = ds.key;
    if (key) {
      shelfModel.set(key, ds.val());
      shelfView.notifyPropertyChanged();
    }
  });

  dbShelf.on("child_changed", (ds) => {
    const key = ds.key;
    if (key) {
      shelfModel.set(key, ds.val());
      shelfView.notifyPropertyChanged();
    }
  });

  dbShelf.on("child_removed", (ds) => {
    const key = ds.key;
    if (key) {
      shelfModel.remove(key);
      shelfView.notifyPropertyChanged();
    }
  });
});

if ("serviceWorker" in navigator) {
  // navigator.serviceWorker.register(new URL("sw.ts", import.meta.url));

  login().then((loginInfo) => {
    auth.setPersistence(loginInfo.save ? "local" : "none");
    auth.signInWithEmailAndPassword(...loginInfo.data);
  });
}
