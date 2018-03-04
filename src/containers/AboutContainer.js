import React, { Component } from "react";
import { View, StyleSheet, Image, Dimensions, ScrollView } from "react-native";
import { connect } from "react-redux";
import { Text } from "../components";
import { setRootNavigatorActions } from "../util/UtilNavigation";
import Colors from "../util/Colors";

const logo = require("../../assets/logo_large.png");

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

    return (
      <ScrollView style={{ flex: 1, backgroundColor: Colors.black }}>
        <View style={{ paddingHorizontal: 20, justifyContent: "center", alignItems: "center" }}>
          <Image source={logo} resizeMode="contain" style={{ width: width * 0.7, height: 120 }} />
        </View>
        <View style={{ padding: 20 }}>
          <Text white>{this.props.about}</Text>
        </View>
      </ScrollView>
    );
  }
}
export default connect(mapStateToProps)(AboutContainer);
