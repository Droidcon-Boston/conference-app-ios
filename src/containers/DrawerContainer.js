import React, { Component } from "react";
import { View, StyleSheet, Text } from "react-native";
import { connect } from "react-redux";

function mapStateToProps(state) {
  return {};
}
class DrawerContainer extends Component {
  static title = "Drawer";
  render() {
    return <View style={{ backgroundColor: Colors.white, flex: 1 }} />;
  }
}
export default connect(mapStateToProps)(DrawerContainer);
