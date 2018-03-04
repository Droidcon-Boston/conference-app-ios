import React, { Component } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity, Image, SectionList } from "react-native";
import PropTypes from "prop-types";
import moment from "moment";

import Text from "./Text";
import Colors from "../util/Colors";
import { getEventLocation, getEventSpeakerId } from "../util/Utility";

const TIME_FORMAT = "hh:mm a";

const Separator = () => {
  return <View style={{ height: 8 }} />;
};

export default class AgendaList extends Component {
  static propTypes = {
    groups: PropTypes.any,
    events: PropTypes.any,
    speakers: PropTypes.any,
    rooms: PropTypes.any,
  };

  renderCellContent(item) {
    console.log("...rendering cell content " + item.get("key"));
    const location = getEventLocation(item, this.props.rooms);
    const time = moment(item.get("startTime")).format(TIME_FORMAT);
    const speakerId = getEventSpeakerId(item);
    if (speakerId) {
      // speaker
      const imageUrl = this.props.speakers.getIn([speakerId, "pictureUrl"]);
      console.log(imageUrl);
      const speakerName = this.props.speakers.getIn([speakerId, "name"]);
      return (
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View style={{ justifyContent: "center" }}>
            <Image
              style={{ width: 50, height: 50, borderRadius: 25 }}
              source={{ uri: imageUrl, cache: "force-cache" }}
            />
          </View>
          <View style={{ paddingHorizontal: 12, flex: 1 }}>
            <Text grey900 Medium style={{ marginVertical: 2 }}>
              {item.get("name")}
            </Text>
            <Text grey500 Italic style={{ fontSize: 15, marginVertical: 2 }}>
              {speakerName}
            </Text>
            <Text Bold green style={{ marginVertical: 2 }}>
              {time}
              <Text grey400 Medium style={{ fontSize: 13 }}>
                {` at ${location}`}
              </Text>
            </Text>
          </View>
        </View>
      );
    } else {
      // no speaker
      return (
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text grey900 Medium>
              {item.get("name")}
            </Text>
            <Text grey400 style={{ fontSize: 13 }}>
              {location}
            </Text>
          </View>
          <Text Bold green>
            {time}
          </Text>
        </View>
      );
    }
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
        <View
          style={{
            paddingHorizontal: 12,
            paddingVertical: 16,
            flex: 1,
          }}
        >
          {this.renderCellContent(item)}
        </View>
      </TouchableOpacity>
    );
  }

  renderSectionHeader(data) {
    const dateFormatted = moment(data.key).format(TIME_FORMAT);
    return (
      <View style={{ height: 35, backgroundColor: Colors.background, justifyContent: "center", paddingHorizontal: 12 }}>
        <Text Medium grey700>
          {dateFormatted}
        </Text>
      </View>
    );
  }
  render() {
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
