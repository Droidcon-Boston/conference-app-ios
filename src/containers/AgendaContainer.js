import React, { Component } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { connect } from "react-redux";

import Colors from "../util/Colors";
import Icons from "../util/Icons";

function mapStateToProps(state) {
  return {};
}

class AgendaContainer extends Component {
  constructor(props) {
    super(props);
    this.props.navigator.setButtons({
      leftButtons: [
        {
          icon: Icons.menu, // for icon button, provide the local image asset name
          id: "menu", // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
        },
      ],
    });
    this.props.navigator.setOnNavigatorEvent(event => {
      console.log(event);
      if (event.id === "menu") {
        this.props.navigator.toggleDrawer({
          side: "left",
          animated: true,
        });
      }
    });
  }
  render() {
    return <View style={{ backgroundColor: Colors.background, flex: 1 }} />;
  }
}
export default connect(mapStateToProps)(AgendaContainer);
