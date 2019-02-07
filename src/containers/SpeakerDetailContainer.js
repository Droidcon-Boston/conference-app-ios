import React, { Component } from "react";
import { View, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity, Linking } from "react-native";
import { connect } from "react-redux";
import { Text, CachedImage } from "../components";
import moment from "moment";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import Colors from "../util/Colors";
import { stripHTML } from "../util/Utility";
import { getTopBarTitle } from "../util/Navigation";

const background_asteroids = require("../../assets/background_asteroids.png");

function mapStateToProps(state) {
  return {
    speakers: state.conf.get("speakers"),
  };
}
class SpeakerDetailContainer extends Component {
  static options(passProps) {
    return {
      topBar: {
        title: getTopBarTitle("Speaker Details"),
      },
    };
  }

  onSelectLink(url) {
    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          console.log("Can't handle url: " + url);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch(err => console.error("An error occurred", err));
  }

  renderSocialButtons() {
    const speaker = this.props.speakers.get(this.props.speakerId);
    const socialProfiles = speaker.get("socialProfiles");

    return (
      <View style={{ paddingRight: 20, flexDirection: "row" }}>
        {socialProfiles
          .map((value, key) => {
            let icon, url;
            switch (key.toLowerCase()) {
              case "twitter":
                icon = "twitter";
                url = `https://twitter.com/${value}`;
                break;
              case "web":
                icon = "web";
                url = value;
                break;
              case "github":
                icon = "github-circle";
                url = `https://github.com/${value}`;
                break;
              case "linkedin":
                icon = "linkedin";
                url = `https://www.linkedin.com/in/${value}`;
                break;
              case "facebook":
                icon = "facebook";
                url = `https://www.facebook.com/${value}`;
                break;
            }
            return (
              <TouchableOpacity
                key={key}
                onPress={() => this.onSelectLink(url)}
                style={{
                  height: 40,
                  width: 40,
                  borderRadius: 20,
                  backgroundColor: Colors.green,
                  justifyContent: "center",
                  alignItems: "center",
                  marginLeft: 12,
                }}
              >
                <Icon name={icon} size={20} color={Colors.black} />
              </TouchableOpacity>
            );
          })
          .toList()}
      </View>
    );
  }
  render() {
    const speaker = this.props.speakers.get(this.props.speakerId);
    const speakerTitle = speaker.get("title");
    const speakerName = speaker.get("name");
    const speakerBio = stripHTML(speaker.get("bio"));
    const speakerOrg = speaker.get("org");
    const imageUrl = speaker.get("pictureUrl");
    const { width, height } = Dimensions.get("window");
    const imageWidth = width * 0.4;
    const topContainerHeight = imageWidth + 120;
    return (
      <View style={{ flex: 1 }}>
        <View style={{ backgroundColor: Colors.black }}>
          <Image style={{ width: width, height: height / 2, opacity: 0.5 }} source={background_asteroids} />
          <View style={{ flex: 1, backgroundColor: Colors.white }} />
        </View>
        <View style={{ flex: 1 }} />
        <ScrollView
          style={{ position: "absolute", top: 0, right: 0, left: 0, bottom: 0, backgroundColor: "transparent" }}
        >
          <View
            style={{
              paddingHorizontal: 20,
              paddingBottom: 30, // make room for social icons
              height: topContainerHeight,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CachedImage
              style={{ width: imageWidth, height: imageWidth, borderRadius: imageWidth / 2, marginBottom: 12 }}
              url={imageUrl}
            />
            <Text white large Bold>
              {speakerName}
            </Text>
            <Text green Medium>
              {`${speakerTitle} @ ${speakerOrg}`}
            </Text>
          </View>
          <View style={{ padding: 20, paddingTop: 35, backgroundColor: Colors.white, minHeight: 300 }}>
            <Text>{speakerBio}</Text>
          </View>
          <View style={{ height: 40, position: "absolute", top: topContainerHeight - 20, right: 0 }}>
            {this.renderSocialButtons()}
          </View>
        </ScrollView>
      </View>
    );
  }
}
export default connect(mapStateToProps)(SpeakerDetailContainer);
