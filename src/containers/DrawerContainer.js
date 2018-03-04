import React, { Component } from "react";
import { View, StyleSheet, Dimensions, Image, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { Navigation } from "react-native-navigation";

import { Text } from "../components";

const logo = require("../../assets/logo_large.png");

import Colors from "../util/Colors";
import Constants from "../util/Constants";

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

    this.props.navigator.setOnNavigatorEvent(event => {
      if (event.type === "DeepLink") {
        this.setState({
          currentScreen: event.link,
        });
      }
    });

    this.state = {
      currentScreen: "AgendaContainer",
    };
  }

  navigateTo(screen) {
    this.props.navigator.handleDeepLink({
      link: screen,
    });
    this.props.navigator.toggleDrawer({ to: "closed" });
  }

  renderOptionLarge({ name, screen }) {
    const selected = this.state.currentScreen === screen;
    const color = selected ? Colors.green : Colors.black;
    return (
      <TouchableOpacity onPress={() => this.navigateTo(screen)}>
        <Text large style={{ paddingVertical: 18, paddingLeft: 20, color: color }}>
          {name}
        </Text>
      </TouchableOpacity>
    );
  }

  renderOptionSmall({ name, screen }) {
    const selected = this.state.currentScreen === screen;
    const color = selected ? Colors.green : Colors.grey400;
    return (
      <TouchableOpacity onPress={() => this.navigateTo(screen)} style={{ height: 40, justifyContent: "center" }}>
        <Text grey style={{ paddingVertical: 15, paddingLeft: 20, color: color }}>
          {name}
        </Text>
      </TouchableOpacity>
    );
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
          {this.renderOptionLarge({ name: "Agenda", screen: "AgendaContainer" })}
          {this.renderOptionLarge({ name: "My Schedule", screen: "MyScheduleContainer" })}
          {this.renderOptionLarge({ name: "Speakers", screen: "SpeakersContainer" })}
          {this.renderOptionLarge({ name: "Social", screen: "SocialContainer" })}
        </View>
        <Divider />
        {this.renderOptionSmall({ name: "SETTINGS", screen: "SettingsContainer" })}
        <Divider />
        {this.renderOptionSmall({ name: "FAQ", screen: "FAQContainer" })}
        <Divider />
        {this.renderOptionSmall({ name: "ABOUT US", screen: "AboutContainer" })}
        <Divider />
        {this.renderOptionSmall({ name: "CODE OF CONDUCT", screen: "COCContainer" })}
      </View>
    );
  }
}
export default connect(mapStateToProps)(DrawerContainer);
