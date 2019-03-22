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
import { TouchableOpacity } from "react-native-gesture-handler";

const logo = require("../../assets/logo.png");
const background_gradient = require("../../assets/background_gradient.png");

function mapStateToProps(state) {
  return {
    about: state.conf.get("about"),
  };
}
class RatingContainer extends Component {
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
    const { width, height } = Dimensions.get("window");
    const textContent = stripHTML(this.props.about);
    return (
      <TouchableOpacity
        onPress={() => {
          Navigation.dismissOverlay(this.props.componentId);
        }}
        style={{
          width,
          height,
          backgroundColor: "black",
          opacity: 0.4,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={{ width: width * 0.8, height: width * 0.8, backgroundColor: Colors.white }} />
      </TouchableOpacity>
    );
  }
}
export default connect(mapStateToProps)(RatingContainer);
