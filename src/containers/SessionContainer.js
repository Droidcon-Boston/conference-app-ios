import React, { Component } from "react";
import { View, StyleSheet, ScrollView, Image, Dimensions, Animated, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { Text } from "../components";
import moment from "moment";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import Colors from "../util/Colors";
import { getEventLocation, getEventSpeakerId } from "../util/Utility";

function mapStateToProps(state) {
  return {
    events: state.conf.get("events"),
    rooms: state.conf.get("rooms"),
    speakers: state.conf.get("speakers"),
  };
}
class SessionContainer extends Component {
  render() {
    const event = this.props.events.get(this.props.eventId);
    const speakerId = getEventSpeakerId(event);
    const eventLocation = getEventLocation(event, this.props.rooms);
    const eventTime = moment(event.get("startTime")).format("hh:mm a");
    const eventDescription = event.get("description");
    let speakerName, speakerTitle, speakerImage;
    if (speakerId && this.props.speakers.get(speakerId)) {
      const speaker = this.props.speakers.get(speakerId);
      speakerName = speaker.get("name");
      speakerTitle = speaker.get("title");
      speakerImage = speaker.get("pictureUrl");
    }

    const imageWidth = Dimensions.get("window").width;
    return (
      <View style={{ flex: 1 }}>
        <View style={{ backgroundColor: Colors.black }}>
          <Image
            style={{ width: imageWidth, height: 200, opacity: 0.5 }}
            blurRadius={10}
            source={{ uri: speakerImage }}
          />
        </View>
        <View style={{ flex: 1 }} />
        <ScrollView
          style={{ position: "absolute", top: 0, right: 0, left: 0, bottom: 0, backgroundColor: "transparent" }}
        >
          <View style={{ height: 120 }}>
            <Text white Bold style={{ fontSize: 25, margin: 20, alignSelf: "flex-end" }}>
              {event.get("name")}
            </Text>
          </View>
          <View style={{ height: 80, padding: 20, flexDirection: "row", alignItems: "center" }}>
            <Image style={{ width: 60, height: 60, borderRadius: 30 }} source={{ uri: speakerImage }} />
            <View style={{ marginLeft: 12 }}>
              <Text green Medium>
                {speakerTitle}
              </Text>
              <Text white large Medium>
                {speakerName}
              </Text>
            </View>
          </View>
          <View style={{ padding: 20, paddingLeft: 12, backgroundColor: Colors.white }}>
            <View style={{ flexDirection: "row" }}>
              <View style={{ width: 40, alignItems: "center" }}>
                <Icon name="map-marker" size={23} color={Colors.green} />
              </View>
              <View style={{ flex: 1 }}>
                <Text BoldItalic>{eventLocation}</Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", marginVertical: 4 }}>
              <View style={{ width: 40, alignItems: "center" }}>
                <Icon name="timer" size={20} color={Colors.green} />
              </View>
              <View style={{ flex: 1 }}>
                <Text BoldItalic>{eventTime}</Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", marginVertical: 4 }}>
              <View style={{ width: 40, alignItems: "center" }}>
                <Icon name="information" size={20} color={Colors.green} />
              </View>
              <View style={{ flex: 1 }}>
                <Text>{eventDescription}</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 175,
              right: 20,
              width: 50,
              height: 50,
              backgroundColor: Colors.green,
              borderRadius: 25,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Icon name="star" size={25} color={Colors.white} />
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}
export default connect(mapStateToProps)(SessionContainer);
