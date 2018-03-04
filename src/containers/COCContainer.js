import React, { Component } from "react";
import { View, StyleSheet, WebView, ActivityIndicator } from "react-native";
import { connect } from "react-redux";
import { setRootNavigatorActions } from "../util/UtilNavigation";

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
    return (
      <WebView
        style={{ flex: 1, padding: 12 }}
        source={{ html: this.props.conductCode }}
        renderLoading={() => <ActivityIndicator />}
        dataDetectorTypes={["link", "address"]}
      />
    );
  }
}
export default connect(mapStateToProps)(COCContainer);
