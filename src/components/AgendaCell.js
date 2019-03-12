import React, { PureComponent } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import moment from "moment";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import Text from "./Text";
import CachedImage from "./CachedImage";
import Colors from "../util/Colors";
import Style from "../util/Style";

import { getEventLocation, getEventSpeakerId } from "../util/Utility";

const TIME_FORMAT = "hh:mm a";

export default class AgendaCell extends PureComponent {
  static propTypes = {
    item: PropTypes.any,
    location: PropTypes.string,
    hasSaved: PropTypes.any,
    onSelect: PropTypes.func,
  };

  renderCellImage({ item, hasEventEnded }) {
    const primarySpeakerName = item.get("primarySpeakerName");
    const imageUrl = item.getIn(["speakerNameToPhotoUrl", primarySpeakerName]);
    const speakerCount = item.get("speakerIds").size;
    const shouldRenderPlus = speakerCount > 1;
    const imageOpacity = hasEventEnded ? 0.6 : 1.0;
    return (
      <View style={{ marginLeft: 12, marginVertical: 12 }}>
        {imageUrl ? (
          <CachedImage
            key={"image" + imageUrl}
            style={{ width: 80, height: 80, borderRadius: 40, opacity: imageOpacity }}
            url={imageUrl}
          />
        ) : (
          <View />
        )}
        {shouldRenderPlus ? (
          <View
            style={{
              position: "absolute",
              bottom: -4,
              right: -4,
              backgroundColor: Colors.lightMossGreen,
              width: 30,
              height: 30,
              borderRadius: 15,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text grey800 Bold>
              {`+${speakerCount - 1}`}
            </Text>
          </View>
        ) : null}
      </View>
    );
  }

  renderCellContent({ item, hasEventEnded }) {
    const location = this.props.location;
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
    const hasSaved = this.props.hasSaved;
    const timeColor = hasEventEnded ? Colors.grey400 : Colors.lightMossGreen;
    return (
      <View style={{ flex: 1, flexDirection: "row" }}>
        <View style={{ justifyContent: "center", flex: 1 }}>
          <Text grey900 Medium>
            {item.get("name")}
          </Text>
          <Text Bold size={16} style={{ marginVertical: 2, color: timeColor }}>
            {timeText}
          </Text>
          {location ? (
            <Text grey500 style={{ fontSize: 13, marginVertical: 2 }}>
              {`at ${location}`}
            </Text>
          ) : (
            <View />
          )}
          {hasSpeaker ? (
            <Text grey800 Bold size={14} style={{ marginVertical: 2 }}>
              {speakersString}
            </Text>
          ) : null}
        </View>
        <View style={{ justifyContent: "center" }}>
          {hasSpeaker ? this.renderCellImage({ item, hasEventEnded }) : null}
        </View>
        {hasSaved ? (
          <View style={{ position: "absolute", top: -4, right: -4, justifyContent: "center", alignItems: "center" }}>
            <Icon name={"star"} size={20} color={Colors.lightMossGreen} />
          </View>
        ) : null}
      </View>
    );
  }

  render() {
    const { item } = this.props;
    const hasEventEnded = moment().valueOf() > moment(item.get("endTime")).valueOf();
    const sideColor = hasEventEnded ? Colors.grey300 : Colors.lightMossGreen;
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
        <View style={{ backgroundColor: sideColor, width: 5 }} />
        <View
          style={{
            paddingHorizontal: 12,
            paddingVertical: 16,
            flex: 1,
          }}
        >
          {this.renderCellContent({ item, hasEventEnded })}
        </View>
      </TouchableOpacity>
    );
  }
}
