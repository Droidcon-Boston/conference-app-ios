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
import SpeakerDetailContainer from "./containers/SpeakerDetailContainer";
import SessionContainer from "./containers/SessionContainer";

const screensToRegister = {
  AboutContainer,
  AgendaContainer,
  COCContainer,
  DrawerContainer,
  FAQContainer,
  MyScheduleContainer,
  SettingsContainer,
  SocialContainer,
  SpeakersContainer,
  SpeakerDetailContainer,
  SessionContainer,
};

export function registerScreens(store, Provider) {
  for (let key in screensToRegister) {
    if (screensToRegister.hasOwnProperty(key)) {
      console.log(key.toString());
      Navigation.registerComponent(key.toString(), () => screensToRegister[key], store, Provider);
    }
  }
}
