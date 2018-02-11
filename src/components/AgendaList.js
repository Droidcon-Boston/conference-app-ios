import React, { Component } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import moment from "moment";

import Text from "./Text";
import Colors from "../util/Colors";

const Separator = () => {
  return <View style={{ height: 8 }} />;
};

export default class AgendaList extends Component {
  static propTypes = {
    day: PropTypes.string.isRequired,
    events: PropTypes.any,
    speakers: PropTypes.any,
    rooms: PropTypes.any,
  };

  getLocation(item) {
    if (!item || !item.get("roomIds")) {
      return undefined;
    }
    let location = "";
    const roomIds = item.get("roomIds").keySeq();
    roomIds.forEach(id => {
      const room = this.props.rooms.get(id);
      if (room && room.get("name")) {
        location = location + room.get("name");
      }
    });
    return location;
  }

  renderCellContent(item) {
    const location = this.getLocation(item);
    const time = moment(item.get("startTime")).format("hh:mm a");
    return (
      <View
        style={{ padding: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center", flex: 1 }}
      >
        <View>
          <Text grey900 Medium>
            {item.get("name")}
          </Text>
          <Text grey400 style={{ fontSize: 13 }}>
            {location}
          </Text>
        </View>
        <Text>{time}</Text>
      </View>
    );
  }

  renderCell(item) {
    return (
      <TouchableOpacity
        onPress={() => this.props.onSelect(item.get("key"))}
        style={{
          flexDirection: "row",
          shadowOpacity: 0.05,
          shadowRadius: 2,
          shadowOffset: { width: 5, height: 5 },
          borderRadius: 5,
          backgroundColor: Colors.white,
        }}
      >
        <View style={{ backgroundColor: Colors.green, width: 5 }} />
        {this.renderCellContent(item)}
      </TouchableOpacity>
    );
  }
  render() {
    return (
      <FlatList
        style={{ padding: 12 }}
        data={this.props.events.toArray()}
        ItemSeparatorComponent={Separator}
        renderItem={({ item }) => this.renderCell(item)}
        keyExtractor={item => item.get("key")}
      />
    );
  }
}
