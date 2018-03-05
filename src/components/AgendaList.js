import React, { Component } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity, Image, SectionList } from "react-native";
import PropTypes from "prop-types";
import moment from "moment";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import Text from "./Text";
import Colors from "../util/Colors";
import Style from "../util/Style";

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
    savedEvents: PropTypes.any,
  };

  renderCellImage(item) {
    const primarySpeakerName = item.get("primarySpeakerName");
    const imageUrl = item.getIn(["speakerNameToPhotoUrl", primarySpeakerName]);
    const speakerCount = item.get("speakerIds").size;
    const shouldRenderPlus = speakerCount > 1;
    return (
      <View style={{ marginLeft: 12, marginVertical: 12 }}>
        <Image style={{ width: 80, height: 80, borderRadius: 40 }} source={{ uri: imageUrl, cache: "force-cache" }} />
        {shouldRenderPlus ? (
          <View
            style={{
              position: "absolute",
              bottom: -4,
              right: -4,
              backgroundColor: Colors.green,
              width: 30,
              height: 30,
              borderRadius: 15,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text white Bold>
              {`+${speakerCount - 1}`}
            </Text>
          </View>
        ) : null}
      </View>
    );
  }

  renderCellContent(item) {
    const location = getEventLocation(item, this.props.rooms);
    const startTime = moment(item.get("startTime")).format(TIME_FORMAT);
    const endTime = item.get("endTime") ? moment(item.get("endTime")).format(TIME_FORMAT) : undefined;
    let timeText = startTime;
    if (endTime) {
      timeText = timeText + " - " + endTime;
    }
    const speakers = item.get("speakerNames");
    let speakersString = "";
    const hasSpeaker = speakers && speakers.size > 0;
    if (hasSpeaker) {
      speakersString = speakers.keySeq().reduce((previous, name, index) => {
        if (index < speakers.size - 1) {
          return previous + name + ", ";
        }
        return previous + name;
      }, "");
    }
    const hasSaved = this.props.savedEvents && this.props.savedEvents.get(item.get("key"));
    return (
      <View style={{ flex: 1, flexDirection: "row" }}>
        <View style={{ justifyContent: "center", flex: 1 }}>
          <Text grey900 Medium>
            {item.get("name")}
          </Text>
          <Text Bold green size={16} style={{ marginVertical: 2 }}>
            {timeText}
          </Text>
          <Text grey500 style={{ fontSize: 13, marginVertical: 2 }}>
            {`at ${location}`}
          </Text>
          {hasSpeaker ? (
            <Text grey800 Bold size={14} style={{ marginVertical: 2 }}>
              {speakersString}
            </Text>
          ) : null}
        </View>
        <View style={{ justifyContent: "center" }}>{hasSpeaker ? this.renderCellImage(item) : null}</View>
        {hasSaved ? (
          <View style={{ position: "absolute", top: -4, right: -4, justifyContent: "center", alignItems: "center" }}>
            <Icon name={"star"} size={20} color={Colors.green} />
          </View>
        ) : null}
      </View>
    );
  }

  renderCell(item) {
    return (
      <TouchableOpacity
        onPress={() => this.props.onSelect(item.get("key"))}
        style={{
          flexDirection: "row",
          borderRadius: 5,
          backgroundColor: Colors.white,
          ...Style.shadow,
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
