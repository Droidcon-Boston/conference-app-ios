import React, { Component } from "react";
import { View, StyleSheet, Dimensions, Image, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { Navigation } from "react-native-navigation";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { Text } from "../components";

const logo = require("../../assets/logo.png");
const background_gradient = require("../../assets/background_gradient.png");

import Colors from "../util/Colors";
import Constants from "../util/Constants";

function mapStateToProps(state) {
  return {};
}
class DrawerContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentScreen: "AgendaContainer",
    };
  }

  navigateTo(screen) {
    Navigation.setStackRoot("main", [
      {
        component: {
          name: screen,
          options: {
            animations: {
              setStackRoot: {
                enabled: true,
              },
            },
          },
        },
      },
    ]);

    Navigation.mergeOptions("main", {
      sideMenu: {
        left: {
          visible: false,
        },
      },
    });

    this.setState({ currentScreen: screen });
  }

  renderOptionLarge({ name, screen, icon }) {
    const selected = this.state.currentScreen === screen;
    const backgroundColor = selected ? Colors.grey200 : "transparent";
    return (
      <TouchableOpacity
        onPress={() => this.navigateTo(screen)}
        style={{ flexDirection: "row", backgroundColor: backgroundColor, height: 50, alignItems: "center" }}
      >
        <View style={{ width: 60, justifyContent: "center", alignItems: "center" }}>
          <Icon name={icon} size={25} color={Colors.grey800} />
        </View>
        <Text Medium style={{ paddingVertical: 8, paddingLeft: 8, color: Colors.grey800 }}>
          {name}
        </Text>
      </TouchableOpacity>
    );
  }

  render() {
    const { width } = Dimensions.get("window");
    return (
      <View style={{ backgroundColor: Colors.white, flex: 1 }}>
        <View style={{ backgroundColor: Colors.blueberry }}>
          <Image style={{ width: width, height: 130 }} source={background_gradient} />
          <View style={{ justifyContent: "center", position: "absolute", top: 20, right: 0, left: 20, bottom: 0 }}>
            <Image source={logo} resizeMode="contain" style={{ width: width * 0.5, height: 60 }} />
          </View>
        </View>
        <View style={{ flex: 1, paddingVertical: 10 }}>
          {this.renderOptionLarge({ name: "Agenda", screen: "AgendaContainer", icon: "calendar-text" })}
          {this.renderOptionLarge({ name: "My Schedule", screen: "MyScheduleContainer", icon: "book" })}
          {this.renderOptionLarge({ name: "FAQ", screen: "FAQContainer", icon: "clipboard-text" })}
          {this.renderOptionLarge({ name: "Social", screen: "SocialContainer", icon: "ticket" })}
          {this.renderOptionLarge({ name: "Code of Conduct", screen: "COCContainer", icon: "book-open" })}
          {this.renderOptionLarge({ name: "Speakers", screen: "SpeakersContainer", icon: "account-multiple" })}
          {this.renderOptionLarge({ name: "Volunteers", screen: "VolunteersContainer", icon: "account-location" })}
          {this.renderOptionLarge({ name: "About Us", screen: "AboutContainer", icon: "information" })}
        </View>
      </View>
    );
  }
}
export default connect(mapStateToProps)(DrawerContainer);
