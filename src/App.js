import { Navigation } from "react-native-navigation";
import firebase from "react-native-firebase";

import { registerScreens } from "./screens";
import { initStore } from "./store";
import { receivedData } from "./reducers/conf";
import { getSavedEvents } from "./reducers/confAsync";

import Constants from "./util/Constants";
import Colors from "./util/Colors";
import Fonts from "./util/Fonts";
import Icons, { loadIcons } from "./util/Icons";
import { cacheData, getCachedData } from "./util/Utility";
import { NavigationRoot } from "./util/Navigation";

export function App() {
  const store = initStore();

  registerScreens(store);

  Navigation.events().registerAppLaunchedListener(() => {
    loadIcons.then(() => {
      Navigation.setRoot(NavigationRoot);
    });
  });

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
}

// loadIcons.then(() => {
// Navigation.startSingleScreenApp({
//   screen: {
//     screen: "AgendaContainer",
//     navigatorButtons: {
//       leftButtons: [
//         {
//           icon: Icons.menu, // for icon button, provide the local image asset name
//           id: "menu", // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
//         },
//       ],
//     },
//     navigatorStyle: Constants.navigatorStyle,
//   },
//   drawer: {
//     left: {
//       screen: "DrawerContainer",
//       passProps: {},
//       disableOpenGesture: false,
//     },
//     style: {
//       drawerShadow: true,
//       contentOverlayColor: "rgba(0,0,0,0.25)",
//       leftDrawerWidth: Constants.drawerWidthPercent,
//     },
//     type: "MMDrawer",
//     animationType: "slide",
//     disableOpenGesture: true,
//   },
//   passProps: {},
//   animationType: "slide-down",
// });
// });
