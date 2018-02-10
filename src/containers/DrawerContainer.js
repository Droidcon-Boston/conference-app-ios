import React, { Component } from "react";
import { View, StyleSheet, Dimensions, Text, Image } from "react-native";
import { connect } from "react-redux";

const logo = require("../../assets/logo_large.png");

import Constants from "../util/Constants";

function mapStateToProps(state) {
  return {};
}
class DrawerContainer extends Component {
  render() {
    const { width } = Dimensions.get("window");
    return (
      <View style={{ backgroundColor: Colors.white, flex: 1 }}>
        <View style={{ backgroundColor: Colors.black, justifyContent: "center", alignItems: "center" }}>
          <Image
            source={logo}
            resizeMode="contain"
            style={{ width: width * (Constants.drawerWidthPercent / 100) * 0.7, height: 150 }}
          />
        </View>
      </View>
    );
  }
}
export default connect(mapStateToProps)(DrawerContainer);
