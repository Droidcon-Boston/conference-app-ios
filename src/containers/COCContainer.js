import React, { Component } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { connect } from "react-redux";
import { Text } from "../components";

import { setRootNavigatorActions } from "../util/UtilNavigation";
import { stripHTML } from "../util/Utility";
import { Navigation } from "react-native-navigation";
import { getTopBarTitle } from "../util/Navigation";
import { getIcon } from "../util/Icons";

function mapStateToProps(state) {
  return {
    conductCode: state.conf.get("conductCode"),
  };
}
class COCContainer extends Component {
  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
  }

  static options() {
    return {
      topBar: {
        title: getTopBarTitle("Code of Conduct"),
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
    const content = stripHTML(this.props.conductCode);
    return (
      <ScrollView style={{ flex: 1, backgroundColor: Colors.backgroundColor }} contentContainerStyle={{ padding: 12 }}>
        <Text>{content}</Text>
      </ScrollView>
    );
  }
}
export default connect(mapStateToProps)(COCContainer);
