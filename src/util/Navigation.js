import Colors from "./Colors";

const StackChildren = [
  {
    component: {
      name: "AgendaContainer",
      options: {
        topBar: {
          title: {
            text: "Agenda",
          },
        },
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
    title: {
      color: Colors.white,
      fontSize: 18,
      fontFamily: Fonts.Bold,
    },
    leftButtons: [{ color: Colors.white }],
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
