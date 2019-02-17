import React, { Component } from "react";
import { View, StyleSheet, ScrollView, Image, Dimensions, Animated, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { Text, CachedImage } from "../components";
import moment from "moment";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { saveEvent, removeSavedEvent } from "../reducers/confAsync";
import Colors from "../util/Colors";
import { getEventLocation, getEventSpeakerId, stripHTML } from "../util/Utility";
import { Navigation } from "react-native-navigation";
import { getTopBarTitle } from "../util/Navigation";

const background_asteroids = require("../../assets/background_asteroids.png");

function mapStateToProps(state) {
  return {
    events: state.conf.get("events"),
    rooms: state.conf.get("rooms"),
    speakers: state.conf.get("speakers"),
    savedEvents: state.conf.get("savedEvents"),
  };
}
class SessionContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topHeight: 0,
    };
  }
  static options(passProps) {
    return {
      topBar: {
        title: getTopBarTitle("Session Details"),
      },
    };
  }

  onSelectSpeaker(id) {
    Navigation.push(this.props.componentId, {
      component: {
        name: "SpeakerDetailContainer",
        passProps: {
          speakerId: id,
        },
      },
    });
  }

  onSaveEvent() {
    const id = this.props.eventId;
    if (this.props.savedEvents.get(id)) {
      this.props.dispatch(removeSavedEvent(id));
    } else {
      this.props.dispatch(saveEvent(id));
    }
  }

  renderSpeakerImages(event) {
    const speakerIds = event.get("speakerIds") && event.get("speakerIds").keySeq();
    if (!speakerIds || speakerIds.size === 0) {
      return;
    }
    // marign of 5 in order to uniformly apply a -5 margin to all images
    return (
      <View style={{ height: 70, flexDirection: "row", marginHorizontal: 5, marginTop: 20, marginBottom: 8 }}>
        {speakerIds
          .map(id => {
            const url = this.props.speakers.getIn([id, "pictureUrl"]);
            return (
              <TouchableOpacity key={url} style={{ marginLeft: -2 }} onPress={() => this.onSelectSpeaker(id)}>
                <CachedImage key={url} style={{ width: 60, height: 60, borderRadius: 30 }} url={url} />
              </TouchableOpacity>
            );
          })
          .toList()}
      </View>
    );
  }

  renderSpeakerNames(event) {
    const speakerIds = event.get("speakerIds") && event.get("speakerIds").keySeq();
    if (!speakerIds || speakerIds.size === 0) {
      return;
    }
    let title = "Speaker";
    if (speakerIds.size > 1) {
      title = "Speakers";
    }
    return (
      <View style={{ marginBottom: 8 }}>
        <Text grey500 Bold size={18} style={{ marginBottom: 4 }}>
          {title}
        </Text>
        {speakerIds.map(id => {
          const name = this.props.speakers.getIn([id, "name"]);
          const org = this.props.speakers.getIn([id, "org"]);
          return (
            <TouchableOpacity key={name} onPress={() => this.onSelectSpeaker(id)}>
              <Text Medium size={16} key={name} style={{ marginVertical: 4 }}>
                {name} <Text grey500 size={12}>{` - ${org}`}</Text>
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  renderSaveButton() {
    if (this.state.topHeight === 0) {
      return;
    }
    const buttonSize = 50;
    const logoName = this.props.savedEvents.get(this.props.eventId) ? "star" : "star-outline";
    return (
      <TouchableOpacity
        onPress={() => this.onSaveEvent()}
        style={{
          position: "absolute",
          top: this.state.topHeight - buttonSize / 2,
          right: 20,
          width: buttonSize,
          height: buttonSize,
          backgroundColor: Colors.lightMossGreen,
          borderRadius: buttonSize / 2,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Icon name={logoName} size={25} color={Colors.white} />
      </TouchableOpacity>
    );
  }

  renderBackground() {
    const { width, height } = Dimensions.get("window");
    return (
      <View style={{ backgroundColor: Colors.black }}>
        <Image style={{ width: width, height: height / 2, opacity: 0.5 }} source={background_asteroids} />
        <View style={{ flex: 1, backgroundColor: Colors.white }} />
      </View>
    );
  }

  render() {
    const dateFormat = "hh:mm a";
    const event = this.props.events.get(this.props.eventId);
    const speakerId = getEventSpeakerId(event);
    const eventLocation = getEventLocation(event, this.props.rooms);
    const startTime = moment(event.get("startTime")).format(dateFormat);
    const endTime = moment(event.get("endTime")).format(dateFormat);
    const eventDescription = stripHTML(event.get("description"));
    let speakerName, speakerTitle, speakerImage;
    if (speakerId && this.props.speakers.get(speakerId)) {
      const speaker = this.props.speakers.get(speakerId);
      speakerName = speaker.get("name");
      speakerTitle = speaker.get("title");
      speakerImage = speaker.get("pictureUrl");
    }

    const { width, height } = Dimensions.get("window");
    const topContainerHeight = width * 0.8;

    return (
      <View style={{ flex: 1 }}>
        {this.renderBackground()}
        <ScrollView
          style={{ position: "absolute", top: 0, right: 0, left: 0, bottom: 0, backgroundColor: "transparent" }}
        >
          <View
            style={{ padding: 20 }}
            onLayout={layoutEvent => this.setState({ topHeight: layoutEvent.nativeEvent.layout.height })}
          >
            <Text white Bold style={{ fontSize: 25 }}>
              {event.get("name")}
            </Text>
            {this.renderSpeakerImages(event)}
            <Text white>{eventLocation}</Text>
            <Text green large Medium>
              {`${startTime} - ${endTime}`}
            </Text>
          </View>
          <View style={{ padding: 20, paddingLeft: 12, backgroundColor: Colors.white, minHeight: 300 }}>
            {this.renderSpeakerNames(event)}
            <View style={{ height: 1, backgroundColor: Colors.grey300 }} />
            <Text style={{ marginVertical: 8 }}>{eventDescription}</Text>
          </View>
          {this.renderSaveButton()}
        </ScrollView>
      </View>
    );
  }
}
export default connect(mapStateToProps)(SessionContainer);
