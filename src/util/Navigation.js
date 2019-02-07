import Colors from "./Colors";
import { Navigation } from "react-native-navigation";

Navigation.setDefaultOptions({
  topBar: {
    visible: true,
    background: {
      color: Colors.black,
    },
    buttonColor: Colors.white,
    backButton: {
      color: Colors.white,
      title: "",
    },
  },
});

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
    children: StackChildren,
    options: MainAppOptions,
  },
};
export const NavigationRoot = {
  root: {
    sideMenu: {
      left: DrawerMenu,
      center: MainApp,
    },
  },
};
