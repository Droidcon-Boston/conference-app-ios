import React, { Component } from "react";
import { View, StyleSheet, Text } from "react-native";
import { connect } from "react-redux";

import Colors from "../util/Colors";

function mapStateToProps(state) {
  return {};
}

class AgendaContainer extends Component {
  render() {
    return <View style={{ backgroundColor: Colors.background, flex: 1 }} />;
  }
}
export default connect(mapStateToProps)(AgendaContainer);
