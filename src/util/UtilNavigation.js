import Icons from "./Icons";

export function setRootNavigatorActions({ navigator, currentScreen, title }) {
  navigator.setButtons({
    leftButtons: [
      {
        icon: Icons.menu,
        id: "menu",
      },
    ],
  });
  navigator.setTitle({
    title: title,
  });

  navigator.setOnNavigatorEvent(event => {
    if (event.id === "menu") {
      navigator.toggleDrawer({
        side: "left",
        animated: true,
      });
    } else if (event.type === "DeepLink") {
      if (event.link !== currentScreen) {
        navigator.resetTo({
          screen: event.link,
          navigatorStyle: Constants.navigatorStyle,
        });
      }
    }
  });
}
