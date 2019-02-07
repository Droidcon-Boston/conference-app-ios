import React, { Component } from "react";
import { View, StyleSheet, TouchableOpacity, FlatList, Linking } from "react-native";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { Text } from "../components";
import { setRootNavigatorActions } from "../util/UtilNavigation";
import Colors from "../util/Colors";
import { getTopBarTitle } from "../util/Navigation";
import { getIcon } from "../util/Icons";
import { Navigation } from "react-native-navigation";

const SOCIAL_DATA = [
  {
    key: "facebook",
    name: "Facebook",
    url: "https://www.facebook.com/droidconbos",
    icon: "facebook",
  },
  {
    key: "twitter",
    name: "Twitter",
    url: "https://twitter.com/droidconbos",
    icon: "twitter",
  },
  {
    key: "instagram",
    name: "Instagram",
    url: "https://www.instagram.com/droidconbos/",
    icon: "instagram",
  },
  {
    key: "linkedin",
    name: "LinkedIn",
    url: "https://www.linkedin.com/groups/8586436/profile",
    icon: "linkedin",
  },
  {
    key: "youtube",
    name: "YouTube",
    url: "https://www.youtube.com/channel/UClv2UAFbLxopI8_9fscZ-ew",
    icon: "youtube-play",
  },
];

const Separator = () => {
  return <View style={{ height: 1, backgroundColor: Colors.grey300 }} />;
};

function mapStateToProps(state) {
  return {};
}
class SocialContainer extends Component {
  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
  }

  static options() {
    return {
      topBar: {
        title: getTopBarTitle("Social"),
        leftButtons: [
          {
            id: "menu",
            icon: getIcon("menu"),
            color: Colors.white,
          },
        ],
        rightButtons: [],
      },
    };
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === "menu") {
      Navigation.mergeOptions(this.props.componentId, {
        sideMenu: {
          left: {
            visible: true,
          },
        },
      });
    }
  }

  onSelect(item) {
    Linking.canOpenURL(item.url)
      .then(supported => {
        if (!supported) {
          console.log("Can't handle url: " + item.url);
        } else {
          return Linking.openURL(item.url);
        }
      })
      .catch(err => console.error("An error occurred", err));
  }

  renderCell(item) {
    return (
      <TouchableOpacity
        onPress={() => this.onSelect(item)}
        style={{ flexDirection: "row", height: 60, alignItems: "center" }}
      >
        <View
          style={{
            backgroundColor: Colors.green,
            height: 40,
            width: 40,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Icon name={item.icon} size={25} color={Colors.black} />
        </View>
        <Text grey800 style={{ marginHorizontal: 12 }}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  }
  render() {
    return (
      <FlatList
        style={{ padding: 12 }}
        data={SOCIAL_DATA}
        ItemSeparatorComponent={Separator}
        renderItem={({ item }) => this.renderCell(item)}
      />
    );
  }
}
export default connect(mapStateToProps)(SocialContainer);
