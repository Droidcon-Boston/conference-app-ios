import { Navigation } from "react-native-navigation";

import AboutContainer from "./containers/AboutContainer";
import AgendaContainer from "./containers/AgendaContainer";
import COCContainer from "./containers/COCContainer";
import DrawerContainer from "./containers/DrawerContainer";
import FAQContainer from "./containers/FAQContainer";
import MyScheduleContainer from "./containers/MyScheduleContainer";
import SettingsContainer from "./containers/SettingsContainer";
import SocialContainer from "./containers/SocialContainer";
import SpeakersContainer from "./containers/SpeakersContainer";

export function registerScreens() {
  Navigation.registerComponent("AboutContainer", () => AboutContainer);
  Navigation.registerComponent("AgendaContainer", () => AgendaContainer);
  Navigation.registerComponent("COCContainer", () => COCContainer);
  Navigation.registerComponent("DrawerContainer", () => DrawerContainer);
  Navigation.registerComponent("FAQContainer", () => FAQContainer);
  Navigation.registerComponent("MyScheduleContainer", () => MyScheduleContainer);
  Navigation.registerComponent("SettingsContainer", () => SettingsContainer);
  Navigation.registerComponent("SocialContainer", () => SocialContainer);
  Navigation.registerComponent("SpeakersContainer", () => SpeakersContainer);
}
