import React, { Component } from "react";
import { View, StyleSheet, Text } from "react-native";
// import { connect } from "react-redux";

function mapStateToProps(state) {
  return {};
}
export default class FAQContainer extends Component {
  static title = "FAQ";
  render() {
    return <View style={{ backgroundColor: "yellow", flex: 1 }} />;
  }
}
// export default connect(mapStateToProps)(AgendaContainer);
