import React, { Component } from "react";
import { View, StyleSheet, Text } from "react-native";
// import { connect } from "react-redux";

function mapStateToProps(state) {
  return {};
}
export default class DrawerContainer extends Component {
  static title = "Drawer";
  render() {
    return <View style={{ backgroundColor: "blue", flex: 1 }} />;
  }
}
// export default connect(mapStateToProps)(AgendaContainer);
