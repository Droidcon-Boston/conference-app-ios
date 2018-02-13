import React, { Component } from "react";
import { View, StyleSheet, ScrollView, Image, Dimensions, Animated, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { Text } from "../components";
import moment from "moment";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import Colors from "../util/Colors";

function mapStateToProps(state) {
  return {
    speakers: state.conf.get("speakers"),
  };
}
class SpeakerDetailContainer extends Component {
  render() {
    const speaker = this.props.speakers.get(this.props.speakerId);
    const speakerTitle = speaker.get("title");
    const speakerName = speaker.get("name");
    const speakerBio = speaker.get("bio");
    const imageUrl = speaker.get("pictureUrl");
    const screenWidth = Dimensions.get("window").width;
    const imageWidth = screenWidth * 0.4;
    const imageHeight = imageWidth + 20 + 20 + 70; // quick hack to get the correct height
    return (
      <View style={{ flex: 1 }}>
        <View style={{ backgroundColor: Colors.black }}>
          <Image
            style={{ width: screenWidth, height: imageHeight, opacity: 0.3 }}
            blurRadius={20}
            source={{ uri: imageUrl }}
          />
        </View>
        <View style={{ flex: 1 }} />
        <ScrollView
          style={{ position: "absolute", top: 0, right: 0, left: 0, bottom: 0, backgroundColor: "transparent" }}
        >
          <View style={{ padding: 20 }}>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Image
                style={{ width: imageWidth, height: imageWidth, borderRadius: imageWidth / 2 }}
                source={{ uri: imageUrl }}
              />
            </View>
            <View style={{ alignItems: "center", justifyContent: "center", height: 70 }}>
              <Text green Medium>
                {speakerTitle}
              </Text>
              <Text white large Bold>
                {speakerName}
              </Text>
            </View>
          </View>
          <View style={{ padding: 20, backgroundColor: Colors.white }}>
            <Text>{speakerBio}</Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}
export default connect(mapStateToProps)(SpeakerDetailContainer);
