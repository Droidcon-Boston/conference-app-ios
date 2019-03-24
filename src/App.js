import { Navigation } from "react-native-navigation";

import { registerScreens } from "./screens";
import { initStore } from "./store";
import { getAllData } from "./db";
import { getSavedEvents } from "./reducers/confAsync";

import { loadIcons } from "./util/Icons";
import { getCachedData } from "./util/Cache";
import { NavigationRoot, initNavigation } from "./util/Navigation";
import { receivedCachedData } from "./reducers/conf";
import { initAuth } from "./reducers/authAsync";

export function App() {
  Navigation.events().registerAppLaunchedListener(() => {
    const store = initStore();

    initNavigation();

    registerScreens(store);

    store.dispatch(getSavedEvents());

    // initialize store with our cached json
    getCachedData((error, data) => {
      if (data) {
        store.dispatch(receivedCachedData(data));
      }
    });

    store.dispatch(getAllData());

    store.dispatch(initAuth());

    loadIcons.then(() => {
      Navigation.setRoot(NavigationRoot);
    });
  });
}
