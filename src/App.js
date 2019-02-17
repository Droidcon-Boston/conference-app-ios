import { Navigation } from "react-native-navigation";
import firebase from "react-native-firebase";

import { registerScreens } from "./screens";
import { initStore } from "./store";
import { receivedData } from "./reducers/conf";
import { getSavedEvents } from "./reducers/confAsync";

import { loadIcons } from "./util/Icons";
import { cacheData, getCachedData } from "./util/Utility";
import { NavigationRoot, initNavigation } from "./util/Navigation";

export function App() {
  Navigation.events().registerAppLaunchedListener(() => {
    const store = initStore();

    initNavigation();

    registerScreens(store);

    store.dispatch(getSavedEvents());

    // --------------
    // Firebase
    // Watch for any realtime database changes and dispatch action
    // --------------
    firebase
      .database()
      .ref()
      .on("value", snapshot => {
        store.dispatch(receivedData(snapshot.val()));
        cacheData(snapshot.val());
      });

    // initialize store with our cached json
    getCachedData((error, data) => {
      if (data) {
        store.dispatch(receivedData(data));
      }
    });

    loadIcons.then(() => {
      Navigation.setRoot(NavigationRoot);
    });
  });
}
