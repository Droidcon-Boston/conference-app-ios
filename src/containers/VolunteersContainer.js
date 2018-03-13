import React, { Component } from "react";
import { View, StyleSheet, Image, Dimensions, FlatList, TouchableOpacity, Linking } from "react-native";
import { connect } from "react-redux";
import { Text } from "../components";
import { setRootNavigatorActions } from "../util/UtilNavigation";
import { createSelector } from "reselect";

import Colors from "../util/Colors";

const Separator = () => {
  return <View style={{ height: 1, backgroundColor: Colors.grey200 }} />;
};

const volsSelector = state => state.conf.get("volunteers");
const sortedVolsSelector = createSelector(volsSelector, vols =>
  vols
    .sort((a, b) => {
      const aName = a.get("lastName").toLowerCase(),
        bName = b.get("lastName").toLowerCase();
      if (aName < bName) return -1;
      if (aName > bName) return 1;
      return 0;
    })
    .map((value, index) => {
      return value.set("key", "cell" + index);
    })
);
function mapStateToProps(state) {
  return {
    vols: sortedVolsSelector(state),
  };
}
class VolunteersContainer extends Component {
  constructor(props) {
    super(props);

    setRootNavigatorActions({
      navigator: this.props.navigator,
      currentScreen: "VolunteersContainer",
      title: "Volunteers",
    });
  }

  onSelect(twitter) {
    const url = `https://twitter.com/${twitter}`;
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

  renderCell(item) {
    const imageUrl = item.get("pictureUrl");
    const name = `${item.get("firstName")} ${item.get("lastName")}`;
    const position = item.get("position");
    const twitter = item.get("twitter");
    const email = item.get("email");
    return (
      <TouchableOpacity
        onPress={() => this.onSelect(twitter)}
        style={{
          flexDirection: "row",
          backgroundColor: Colors.white,
        }}
      >
        <View style={{ width: 5, backgroundColor: Colors.green }} />
        <View
          style={{
            padding: 12,
            flex: 1,
          }}
        >
          <Text Medium size={18} grey800>
            {name}
          </Text>
          <Text grey500 size={12} style={{ paddingTop: 2 }}>
            {position}
          </Text>
          <Text grey500 size={12} style={{ paddingTop: 2 }}>
            {`Twitter @${twitter}`}
          </Text>
          <Text grey500 size={12} style={{ paddingTop: 2 }}>
            {`Email ${email}`}
          </Text>
        </View>
        <View style={{ justifyContent: "center", marginRight: 16 }}>
          <Image style={{ width: 60, height: 60, borderRadius: 30 }} source={{ uri: imageUrl, cache: "force-cache" }} />
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <FlatList
        data={this.props.vols.toArray()}
        ItemSeparatorComponent={Separator}
        renderItem={({ item }) => this.renderCell(item)}
        keyExtractor={item => item.get("key")}
      />
    );
  }
}
export default connect(mapStateToProps)(VolunteersContainer);
