import { StatusBar } from "react-native";
import { Navigation } from "react-native-navigation";
import { Provider } from "react-redux";
import firebase from "react-native-firebase";

import { registerScreens } from "./screens";
import { initStore } from "./store";
import { receivedData } from "./reducers/conf";

import Constants from "./util/Constants";
import Colors from "./util/Colors";
import Fonts from "./util/Fonts";
import Icons, { loadIcons } from "./util/Icons";

StatusBar.setBarStyle("light-content");

const store = initStore();
registerScreens(store, Provider);

loadIcons.then(() => {
  Navigation.startSingleScreenApp({
    screen: {
      screen: "AgendaContainer",
      navigatorButtons: {
        leftButtons: [
          {
            icon: Icons.menu, // for icon button, provide the local image asset name
            id: "menu", // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
          },
        ],
      },
      navigatorStyle: Constants.navigatorStyle,
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
        leftDrawerWidth: Constants.drawerWidthPercent,
      },
      type: "MMDrawer",
      animationType: "slide",
      disableOpenGesture: false,
    },
    passProps: {},
    animationType: "slide-down",
  });
});

// --------------
// Firebase
// Watch for any realtime database changes and dispatch action
// --------------

// TODO uncomment this
/*
firebase
  .database()
  .ref()
  .on("value", snapshot => {
    store.dispatch(receivedData(snapshot.val()));
  });
  */

// initialize store with our cached json
store.dispatch(receivedData(require("../conferenceData.json")));
