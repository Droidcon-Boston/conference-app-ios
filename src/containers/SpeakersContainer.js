import React, { Component } from "react";
import { View, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { createSelector } from "reselect";

import { Text, CachedImage } from "../components";

import Colors from "../util/Colors";
import Style from "../util/Style";
import { setRootNavigatorActions } from "../util/UtilNavigation";
import { stripHTML } from "../util/Utility";
import { Navigation } from "react-native-navigation";
import { getTopBarTitle } from "../util/Navigation";
import { getIcon } from "../util/Icons";

const Separator = () => {
  return <View style={{ height: 4 }} />;
};

const speakersSelector = state => state.conf.get("speakers");
const sortedSpeakersSelector = createSelector(
  speakersSelector,
  speakers =>
    speakers
      .sort((a, b) => {
        const aName = a.get("lastName").toLowerCase(),
          bName = b.get("lastName").toLowerCase();
        if (aName < bName) return -1;
        if (aName > bName) return 1;
        return 0;
      })
      .map((value, index) => {
        return value.set("key", index);
      })
);
function mapStateToProps(state) {
  return {
    speakers: sortedSpeakersSelector(state),
  };
}
class SpeakersContainer extends Component {
  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
  }

  static options() {
    return {
      topBar: {
        title: getTopBarTitle("Speakers"),
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

  onSelect(id) {
    Navigation.push(this.props.componentId, {
      component: {
        name: "SpeakerDetailContainer",
        passProps: {
          speakerId: id,
        },
      },
    });
  }

  renderCell(item) {
    const imageUrl = item.get("pictureUrl");
    const name = item.get("name");
    const description = stripHTML(item.get("bio"));
    const org = item.get("org");
    return (
      <TouchableOpacity
        onPress={() => this.onSelect(item.get("key"))}
        style={{
          flexDirection: "row",
          backgroundColor: Colors.white,
          ...Style.shadow,
        }}
      >
        <View style={{ width: 5, backgroundColor: Colors.lightMossGreen }} />
        <View
          style={{
            padding: 16,
            flex: 1,
          }}
        >
          <Text Medium size={17}>
            {name}
            <Text grey500 size={14}>{` - ${org}`}</Text>
          </Text>
          <Text grey500 numberOfLines={2} style={{ paddingTop: 4 }}>
            {description}
          </Text>
        </View>
        <View style={{ justifyContent: "center", marginRight: 16 }}>
          <CachedImage style={{ width: 56, height: 56, borderRadius: 28 }} url={imageUrl} />
        </View>
      </TouchableOpacity>
    );
  }
  render() {
    return (
      <FlatList
        data={this.props.speakers.toArray()}
        ItemSeparatorComponent={Separator}
        renderItem={({ item }) => this.renderCell(item)}
        keyExtractor={item => item.get("key")}
      />
    );
  }
}
export default connect(mapStateToProps)(SpeakersContainer);
