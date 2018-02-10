import { Navigation } from "react-native-navigation";
import { Provider } from "react-redux";
import firebase from "react-native-firebase";

import { registerScreens } from "./screens";
import { initStore } from "./store";
import { receivedData } from "./reducers/conf";

const store = initStore();
registerScreens(store, Provider);

Navigation.startSingleScreenApp({
  screen: {
    title: "Agenda",
    screen: "AgendaContainer",
    navigatorStyle: {},
    navigatorButtons: {},
  },
  drawer: {
    left: {
      screen: "DrawerContainer",
      passProps: {},
      disableOpenGesture: false,
    },
    style: {
      drawerShadow: true,
      contentOverlayColor: "rgba(0,0,0,0.25)",
      leftDrawerWidth: 75,
    },
    type: "MMDrawer",
    animationType: "slide",
    disableOpenGesture: false,
  },
  passProps: {},
  animationType: "slide-down",
});

// --------------
// Firebase
// Watch for any realtime database changes and dispatch action
// --------------
firebase
  .database()
  .ref()
  .on("value", snapshot => {
    store.dispatch(receivedData(snapshot.val()));
  });
