import React, { PureComponent } from "react";
import { View, Image } from "react-native";
import PropTypes from "prop-types";

import Colors from "../util/Colors";
import Style from "../util/Style";

export default class SpeakerImage extends PureComponent {
  static propTypes = {
    url: PropTypes.string.isRequired,
  };

  render() {
    return (
      <Image
        {...this.props}
        source={{ uri: this.props.url, cache: "force-cache" }}
        style={[{ backgroundColor: Colors.grey200 }, this.props.style]}
      />
    );
  }
}
