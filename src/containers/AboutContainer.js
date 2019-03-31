import React, { Component } from "react";
import { View, Linking, Image, Dimensions, ScrollView } from "react-native";
import { connect } from "react-redux";
import HTML from "react-native-render-html";
import { stripHTML } from "../util/Utility";
import Colors from "../util/Colors";
import { Navigation } from "react-native-navigation";
import { getTopBarTitle } from "../util/Navigation";
import { getIcon } from "../util/Icons";
import Fonts from "../util/Fonts";

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
    const { width } = Dimensions.get("window");
    const textContent = this.props.about;
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
        <HTML
          containerStyle={{ padding: 20 }}
          html={textContent}
          imagesMaxWidth={width}
          baseFontStyle={{ fontFamily: Fonts.Regular }}
          onLinkPress={(event, href) => {
            this.onSelectLink(href);
          }}
        />
      </ScrollView>
    );
  }
}
export default connect(mapStateToProps)(AboutContainer);
