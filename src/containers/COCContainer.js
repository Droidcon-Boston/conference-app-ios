import React, { Component } from "react";
import { View, StyleSheet, ScrollView, Dimensions, Linking } from "react-native";
import { connect } from "react-redux";
import HTML from "react-native-render-html";

import { setRootNavigatorActions } from "../util/UtilNavigation";
import { stripHTML } from "../util/Utility";
import { Navigation } from "react-native-navigation";
import { getTopBarTitle } from "../util/Navigation";
import { getIcon } from "../util/Icons";
import Fonts from "../util/Fonts";

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

  onSelectLink(url) {
    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          console.log("Can't handle url: " + url);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch(err => console.error("An error occurred", err));
  }

  render() {
    const content = this.props.conductCode;
    return (
      <ScrollView style={{ flex: 1, backgroundColor: Colors.backgroundColor }} contentContainerStyle={{ padding: 12 }}>
        <HTML
          html={content}
          imagesMaxWidth={Dimensions.get("window").width}
          baseFontStyle={{ fontFamily: Fonts.Regular }}
          onLinkPress={(event, href) => {
            this.onSelectLink(href);
          }}
        />
      </ScrollView>
    );
  }
}
export default connect(mapStateToProps)(COCContainer);
