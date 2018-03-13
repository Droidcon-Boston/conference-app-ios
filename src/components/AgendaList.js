import React, { PureComponent } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity, Image, SectionList } from "react-native";
import PropTypes from "prop-types";
import moment from "moment";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import AgendaCell from "./AgendaCell";
import Text from "./Text";
import Colors from "../util/Colors";
import Style from "../util/Style";

import { getEventLocation, getEventSpeakerId } from "../util/Utility";

const TIME_FORMAT = "hh:mm a";

const Separator = () => {
  return <View style={{ height: 8 }} />;
};

export default class AgendaList extends PureComponent {
  static propTypes = {
    groups: PropTypes.any,
    events: PropTypes.any,
    speakers: PropTypes.any,
    rooms: PropTypes.any,
    savedEvents: PropTypes.any,
  };

  renderCell(item) {
    const location = getEventLocation(item, this.props.rooms);
    const hasSaved = this.props.savedEvents && this.props.savedEvents.get(item.get("key"));
    return <AgendaCell item={item} location={location} hasSaved={hasSaved} onSelect={this.props.onSelect} />;
  }

  renderSectionHeader(data) {
    const dateFormatted = moment(data.key).format(TIME_FORMAT);
    return (
      <View
        style={{
          height: 35,
          backgroundColor: Colors.background,
          justifyContent: "center",
          paddingHorizontal: 12,
          ...Style.shadow,
        }}
      >
        <Text Medium grey700>
          {dateFormatted}
        </Text>
      </View>
    );
  }
  render() {
    console.log("RENDERING AGENDALIST");
    if (this.props.groups) {
      return (
        <SectionList
          renderItem={({ item }) => this.renderCell(item)}
          renderSectionHeader={({ section }) => this.renderSectionHeader(section)}
          ItemSeparatorComponent={Separator}
          sections={this.props.groups.toArray()}
          keyExtractor={item => item.get("key")}
        />
      );
    } else {
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
}
