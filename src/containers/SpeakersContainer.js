import React, { Component } from "react";
import { View, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { createSelector } from "reselect";

import { Text } from "../components";

import Colors from "../util/Colors";
import { setRootNavigatorActions } from "../util/UtilNavigation";

const Separator = () => {
  return <View style={{ height: 1, backgroundColor: Colors.grey100 }} />;
};

const speakersSelector = state => state.conf.get("speakers");
const sortedSpeakersSelector = createSelector(speakersSelector, speakers =>
  speakers
    .sort((a, b) => {
      if (a.get("isFeatured") && !b.get("isFeatured")) {
        return -1;
      } else if (b.get("isFeatured") && !a.get("isFeatured")) {
        return 1;
      }

      return a.get("name") > b.get("name");
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

    setRootNavigatorActions({
      navigator: this.props.navigator,
      currentScreen: "SpeakersContainer",
      title: "Speakers",
    });
  }

  onSelect(id) {
    console.log("selected speaker", id);
  }

  renderCell(item) {
    const imageUrl = item.get("pictureUrl");
    const name = item.get("name");
    const description = item.get("bio");
    return (
      <TouchableOpacity
        onPress={() => this.onSelect(item.get("key"))}
        style={{
          flexDirection: "row",
          backgroundColor: Colors.white,
        }}
      >
        <View style={{ justifyContent: "center" }}>
          <Image style={{ width: 50, height: 50, borderRadius: 25 }} source={{ uri: imageUrl }} />
        </View>
        <View
          style={{
            paddingHorizontal: 12,
            paddingVertical: 16,
            flex: 1,
          }}
        >
          <Text Medium>{name}</Text>
          <Text grey500 numberOfLines={2} style={{ paddingTop: 2 }}>
            {description}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
  render() {
    return (
      <FlatList
        style={{ paddingHorizontal: 20, paddingVertical: 12 }}
        data={this.props.speakers.toArray()}
        ItemSeparatorComponent={Separator}
        renderItem={({ item }) => this.renderCell(item)}
        keyExtractor={item => item.get("key")}
      />
    );
  }
}
export default connect(mapStateToProps)(SpeakersContainer);
