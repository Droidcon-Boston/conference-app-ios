import React, { Component } from "react";
import { View, StyleSheet, Text } from "react-native";
import { connect } from "react-redux";
import Icons from "../util/Icons";
import Colors from "../util/Colors";
import { setRootNavigatorActions } from "../util/UtilNavigation";

function mapStateToProps(state) {
  return {};
}
class MyScheduleContainer extends Component {
  constructor(props) {
    super(props);

    setRootNavigatorActions({
      navigator: this.props.navigator,
      currentScreen: "MyScheduleContainer",
      title: "My Schedule",
    });
  }
  render() {
    return <View style={{ backgroundColor: Colors.background, flex: 1 }} />;
  }
}
export default connect(mapStateToProps)(MyScheduleContainer);
