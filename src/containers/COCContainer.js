import React, { Component } from "react";
import { View, StyleSheet, Text } from "react-native";
import { connect } from "react-redux";
import { setRootNavigatorActions } from "../util/UtilNavigation";

function mapStateToProps(state) {
  return {};
}
class COCContainer extends Component {
  constructor(props) {
    super(props);

    setRootNavigatorActions({
      navigator: this.props.navigator,
      currentScreen: "COCContainer",
      title: "Code of Conduct",
    });
  }
  render() {
    return <View style={{ flex: 1 }} />;
  }
}
export default connect(mapStateToProps)(COCContainer);
