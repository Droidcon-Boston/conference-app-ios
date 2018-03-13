import React, { Component } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { connect } from "react-redux";
import { Text } from "../components";

import { setRootNavigatorActions } from "../util/UtilNavigation";
import { stripHTML } from "../util/Utility";

function mapStateToProps(state) {
  return {
    conductCode: state.conf.get("conductCode"),
  };
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
    const content = stripHTML(this.props.conductCode);
    return (
      <ScrollView style={{ flex: 1, padding: 12, backgroundColor: Colors.backgroundColor }}>
        <Text>{content}</Text>
      </ScrollView>
    );
  }
}
export default connect(mapStateToProps)(COCContainer);
