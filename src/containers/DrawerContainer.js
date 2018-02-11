import React, { Component } from "react";
import { View, StyleSheet, Dimensions, Image, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { Navigation } from "react-native-navigation";

import { Text } from "../components";

const logo = require("../../assets/logo_large.png");

import Colors from "../util/Colors";
import Constants from "../util/Constants";

const OptionLarge = props => {
  const color = props.selected ? Colors.green : Colors.black;
  return (
    <TouchableOpacity onPress={() => props.onPress(props.name)}>
      <Text large style={{ paddingVertical: 18, paddingLeft: 20, color: color }}>
        {props.name}
      </Text>
    </TouchableOpacity>
  );
};

const Divider = props => {
  return <View style={{ backgroundColor: Colors.grey200, height: 1 }} />;
};

const OptionSmall = props => {
  return (
    <TouchableOpacity onPress={() => props.onPress(props.name)} style={{ height: 40, justifyContent: "center" }}>
      <Text grey style={{ paddingVertical: 15, paddingLeft: 20, color: Colors.grey400 }}>
        {props.name}
      </Text>
    </TouchableOpacity>
  );
};

function mapStateToProps(state) {
  return {};
}
class DrawerContainer extends Component {
  constructor(props) {
    super(props);

    Navigation.getCurrentlyVisibleScreenId().then(value => {
      console.log("value::", value);
    });

    this.state = {
      currentScreen: "AgendaController",
    };
  }

  navigateTo(screen) {
    this.props.navigator.handleDeepLink({
      link: screen,
    });
    this.props.navigator.toggleDrawer({ to: "closed" });
  }
  render() {
    const { width } = Dimensions.get("window");
    return (
      <View style={{ backgroundColor: Colors.white, flex: 1 }}>
        <View style={{ backgroundColor: Colors.black, padding: 20, justifyContent: "center" }}>
          <Image
            source={logo}
            resizeMode="contain"
            style={{ width: width * (Constants.drawerWidthPercent / 100) * 0.7, height: 120 }}
          />
        </View>
        <View style={{ flex: 1, paddingVertical: 10 }}>
          <OptionLarge name={"Agenda"} selected onPress={() => this.navigateTo("AgendaContainer")} />
          <OptionLarge name={"My Schedule"} onPress={() => this.navigateTo("MyScheduleContainer")} />
          <OptionLarge name={"Speakers"} onPress={() => this.navigateTo("SpeakersContainer")} />
          <OptionLarge name={"Social"} onPress={() => this.navigateTo("SocialContainer")} />
        </View>
        <Divider />
        <OptionSmall name="SETTINGS" onPress={() => this.navigateTo("SettingsContainer")} />
        <Divider />
        <OptionSmall name="FAQ" onPress={() => this.navigateTo("FAQContainer")} />
        <Divider />
        <OptionSmall name="ABOUT US" onPress={() => this.navigateTo("AboutContainer")} />
        <Divider />
        <OptionSmall name="CODE OF CONDUCT" onPress={() => this.navigateTo("COCContainer")} />
      </View>
    );
  }
}
export default connect(mapStateToProps)(DrawerContainer);
