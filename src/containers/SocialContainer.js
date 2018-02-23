import React, { Component } from "react";
import { View, StyleSheet, Text } from "react-native";
import { connect } from "react-redux";
import { setRootNavigatorActions } from "../util/UtilNavigation";

function mapStateToProps(state) {
  return {};
}
class SocialContainer extends Component {
  constructor(props) {
    super(props);

    setRootNavigatorActions({
      navigator: this.props.navigator,
      currentScreen: "SocialContainer",
      title: "Social",
    });
  }
  render() {
    return <View style={{ flex: 1 }} />;
  }
}
export default connect(mapStateToProps)(SocialContainer);
