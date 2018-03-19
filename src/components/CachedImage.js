import React, { PureComponent } from "react";
import { View, Image } from "react-native";
import PropTypes from "prop-types";
import FastImage from "react-native-fast-image";
import queryString from "query-string";

import Colors from "../util/Colors";
import Style from "../util/Style";

export default class CachedImage extends PureComponent {
  static propTypes = {
    url: PropTypes.string.isRequired,
  };

  render() {
    if (!this.props.url) {
      return <View style={[{ backgroundColor: Colors.grey200 }, this.props.style]} />;
    }
    const parsed = queryString.parse(this.props.url);
    return (
      <FastImage
        {...this.props}
        source={{ uri: this.props.url, priority: FastImage.priority.high, headers: { token: parsed.token } }}
        style={[{ backgroundColor: Colors.grey200 }, this.props.style]}
      />
    );
  }
}
