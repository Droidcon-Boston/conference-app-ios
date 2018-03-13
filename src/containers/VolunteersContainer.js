import React, { Component } from "react";
import { View, StyleSheet, Image, Dimensions, ScrollView } from "react-native";
import { connect } from "react-redux";
import { Text } from "../components";
import { setRootNavigatorActions } from "../util/UtilNavigation";
import Colors from "../util/Colors";

function mapStateToProps(state) {
  return {
    about: state.conf.get("about"),
  };
}
class VolunteersContainer extends Component {
  constructor(props) {
    super(props);

    setRootNavigatorActions({
      navigator: this.props.navigator,
      currentScreen: "VolunteersContainer",
      title: "Volunteers",
    });
  }
  render() {
    const { width } = Dimensions.get("window");

    return <ScrollView style={{ flex: 1, backgroundColor: Colors.backgroundColor }} />;
  }
}
export default connect(mapStateToProps)(VolunteersContainer);
