import * as React from "react";
import { Navigation } from "react-native-navigation";
import { Provider } from "react-redux";

import AboutContainer from "./containers/AboutContainer";
import AgendaContainer from "./containers/AgendaContainer";
import COCContainer from "./containers/COCContainer";
import DrawerContainer from "./containers/DrawerContainer";
import FAQContainer from "./containers/FAQContainer";
import MyScheduleContainer from "./containers/MyScheduleContainer";
import RatingContainer from "./containers/RatingContainer";
import SettingsContainer from "./containers/SettingsContainer";
import SocialContainer from "./containers/SocialContainer";
import SpeakersContainer from "./containers/SpeakersContainer";
import SpeakerDetailContainer from "./containers/SpeakerDetailContainer";
import SessionContainer from "./containers/SessionContainer";
import VolunteersContainer from "./containers/VolunteersContainer";

const screensToRegister = {
  AboutContainer,
  AgendaContainer,
  COCContainer,
  DrawerContainer,
  FAQContainer,
  MyScheduleContainer,
  RatingContainer,
  SettingsContainer,
  SocialContainer,
  SpeakersContainer,
  SpeakerDetailContainer,
  SessionContainer,
  VolunteersContainer,
};

// loop through screensToRegister
// the key of each element is used as the screen identifier
// each screen is wrapped in a Redux higher-order-component
export function registerScreens(store) {
  for (let key in screensToRegister) {
    if (screensToRegister.hasOwnProperty(key)) {
      const Screen = screensToRegister[key];
      Navigation.registerComponent(
        key.toString(),
        () => props => (
          <Provider store={store}>
            <Screen {...props} />
          </Provider>
        ),
        () => Screen
      );
    }
  }
}
