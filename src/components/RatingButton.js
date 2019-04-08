import React, { PureComponent } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import moment from "moment";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import Colors from "../util/Colors";
import Style from "../util/Style";

export default class RatingButton extends PureComponent {
  static propTypes = {
    rating: PropTypes.number,
    onSelect: PropTypes.func,
  };

  render() {
    const { onSelect, rating = 0, style } = this.props;
    return (
      <TouchableOpacity
        onPress={onSelect}
        style={[
          {
            flexDirection: "row",
          },
          style,
        ]}
      >
        <Star selected={rating >= 1} />
        <Star selected={rating >= 2} />
        <Star selected={rating >= 3} />
        <Star selected={rating >= 4} />
        <Star selected={rating >= 5} />
      </TouchableOpacity>
    );
  }
}

const Star = ({ selected }) => (
  <Icon
    name={"star"}
    color={selected ? Colors.lightMossGreen : "black"}
    style={{ opacity: selected ? 1.0 : 0.5 }}
    size={20}
  />
);
