import { StatusBar } from "react-native";
import { Navigation } from "react-native-navigation";
import { Provider } from "react-redux";
import firebase from "react-native-firebase";

import { registerScreens } from "./screens";
import { initStore } from "./store";
import { receivedData } from "./reducers/conf";

import Colors from "./util/Colors";
import Icons, { loadIcons } from "./util/IconsRasterized";

StatusBar.setBarStyle("light-content");

const store = initStore();
registerScreens(store, Provider);

loadIcons.then(() => {
  Navigation.startSingleScreenApp({
    screen: {
      title: "Droidcon Boston",
      screen: "AgendaContainer",
      navigatorStyle: {
        navBarTextColor: Colors.white, // change the text color of the title (remembered across pushes)
        navBarTextFontSize: 18, // change the font size of the title
        // navBarTextFontFamily: "font-name", // Changes the title font
        navBarBackgroundColor: Colors.black, // change the background color of the nav bar (remembered across pushes)
      },
      navigatorButtons: {
        leftButtons: [
          {
            icon: Icons.menu, // for icon button, provide the local image asset name
            id: "menu", // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
          },
        ],
      },
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
