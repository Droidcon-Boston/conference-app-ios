import Colors from "./Colors";
import { Navigation } from "react-native-navigation";

export function initNavigation() {
  Navigation.setDefaultOptions({
    topBar: {
      visible: true,
      background: {
        color: Colors.blueberry,
      },
      buttonColor: Colors.white,
      backButton: {
        color: Colors.white,
        title: "",
      },
    },
    statusBar: {
      visible: true,
      style: "light",
    },
  });
}

export function getTopBarTitle(title) {
  return {
    color: Colors.white,
    fontSize: 18,
    fontFamily: Fonts.Bold,
    text: title,
  };
}

const StackChildren = [
  {
    component: {
      name: "AgendaContainer",
      options: {
        topBar: {},
      },
    },
  },
];
const DrawerMenu = {
  component: {
    name: "DrawerContainer",
  },
};
const MainAppOptions = {
  statusBar: {
    style: "light",
  },
  topBar: {
    background: {
      color: Colors.black,
    },
  },
};
const MainApp = {
  stack: {
    id: "main",
    children: StackChildren,
    options: MainAppOptions,
  },
};
export const NavigationRoot = {
  root: {
    sideMenu: {
      id: "root",
      left: DrawerMenu,
      center: MainApp,
    },
  },
};
