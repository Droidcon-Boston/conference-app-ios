import React, { Component } from "react";
import { View, StyleSheet, Text } from "react-native";
// import { connect } from "react-redux";

function mapStateToProps(state) {
  return {};
}
export default class AgendaContainer extends Component {
  static title = "Agenda";
  render() {
    return <View style={{ backgroundColor: "yellow", flex: 1 }} />;
  }
}
// export default connect(mapStateToProps)(AgendaContainer);
