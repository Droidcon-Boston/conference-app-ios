import React, { Component } from "react";
import { View, StyleSheet, Text, FlatList } from "react-native";
import PropTypes from "prop-types";

import Colors from "../util/Colors";

const Separator = () => {
  return <View style={{ height: 6 }} />;
};

export default class AgendaList extends Component {
  static propTypes = {
    day: PropTypes.string.isRequired,
    events: PropTypes.any,
  };
  renderItem(props) {
    console.log(props);
    return (
      <View
        style={{
          backgroundColor: Colors.white,
          height: 60,
          marginHorizontal: 12,
          shadowOpacity: 0.05,
          shadowRadius: 2,
          shadowOffset: { width: 5, height: 5 },
          borderRadius: 5,
        }}
      >
        <Text>{props.get("name")}</Text>
      </View>
    );
  }
  render() {
    console.log(this.props.events.toJS());
    return (
      <FlatList
        style={{ paddingVertical: 12 }}
        data={this.props.events.toArray()}
        ItemSeparatorComponent={Separator}
        renderItem={({ item }) => this.renderItem(item)}
        keyExtractor={item => item.get("key")}
      />
    );
  }
}
