import { Navigation } from "react-native-navigation";

import { registerScreens } from "./screens";
import firebase from "react-native-firebase";

firebase
  .database()
  .ref()
  .on("value", snapshot => {
    console.log("snapshot ");
    console.log(snapshot.val());
  });

registerScreens();

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
