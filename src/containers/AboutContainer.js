import React, { Component } from "react";
import { View, StyleSheet, Image, Dimensions, ScrollView } from "react-native";
import { connect } from "react-redux";
import { Text } from "../components";
import { setRootNavigatorActions } from "../util/UtilNavigation";
import { stripHTML } from "../util/Utility";
import Colors from "../util/Colors";

const logo = require("../../assets/logo_large.png");
const background_asteroids = require("../../assets/background_asteroids.png");

function mapStateToProps(state) {
  return {
    about: state.conf.get("about"),
  };
}
class AboutContainer extends Component {
  constructor(props) {
    super(props);

    setRootNavigatorActions({
      navigator: this.props.navigator,
      currentScreen: "AboutContainer",
      title: "About",
    });
  }
  render() {
    const { width } = Dimensions.get("window");
    const textContent = stripHTML(this.props.about);
    return (
      <ScrollView style={{ flex: 1, backgroundColor: Colors.backgroundColor }}>
        <View style={{ backgroundColor: Colors.black }}>
          <Image style={{ width: width, height: 160, opacity: 0.4 }} source={background_asteroids} />
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
            <Image source={logo} resizeMode="contain" style={{ width: width * 0.7, height: 120 }} />
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
