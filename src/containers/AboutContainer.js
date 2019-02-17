import React, { Component } from "react";
import { View, StyleSheet, Image, Dimensions, ScrollView } from "react-native";
import { connect } from "react-redux";
import { Text } from "../components";
import { setRootNavigatorActions } from "../util/UtilNavigation";
import { stripHTML } from "../util/Utility";
import Colors from "../util/Colors";
import { Navigation } from "react-native-navigation";
import { getTopBarTitle } from "../util/Navigation";
import { getIcon } from "../util/Icons";

const logo = require("../../assets/logo.png");
const background_gradient = require("../../assets/background_gradient.png");

function mapStateToProps(state) {
  return {
    about: state.conf.get("about"),
  };
}
class AboutContainer extends Component {
  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
  }

  static options() {
    return {
      topBar: {
        title: getTopBarTitle("About"),
        leftButtons: [
          {
            id: "menu",
            icon: getIcon("menu"),
            color: Colors.white,
          },
        ],
        rightButtons: [],
      },
    };
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === "menu") {
      Navigation.mergeOptions(this.props.componentId, {
        sideMenu: {
          left: {
            visible: true,
          },
        },
      });
    }
  }

  render() {
    const { width } = Dimensions.get("window");
    const textContent = stripHTML(this.props.about);
    return (
      <ScrollView style={{ flex: 1, backgroundColor: Colors.backgroundColor }}>
        <View style={{ backgroundColor: Colors.black }}>
          <Image style={{ width: width, height: 150 }} source={background_gradient} />
          <View
            style={{
              paddingHorizontal: 20,
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            }}
          >
            <Image source={logo} resizeMode="contain" style={{ width: width * 0.6, height: 90 }} />
          </View>
        </View>
        <View style={{ padding: 20 }}>
          <Text>{textContent}</Text>
        </View>
      </ScrollView>
    );
  }
}
export default connect(mapStateToProps)(AboutContainer);
