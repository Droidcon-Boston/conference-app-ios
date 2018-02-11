import { Text as RNText } from "react-native";
import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import Fonts from "../util/Fonts";
import Colors from "../util/Colors";

export default class Text extends PureComponent {
  getFont() {
    const fontNames = Object.keys(Fonts);
    let font = Fonts.Regular;
    fontNames.forEach(name => {
      if (this.props.hasOwnProperty(name)) {
        font = Fonts[name];
        return;
      }
    });
    return font;
  }
  getSize() {
    if (this.props.large) {
      return 18;
    }
  }
  getColor() {
    const colorNames = Object.keys(Colors);
    let color = Colors.grey700;
    colorNames.forEach(name => {
      if (this.props.hasOwnProperty(name)) {
        color = Colors[name];
        return;
      }
    });
    return color;
  }
  render() {
    return (
      <RNText
        {...this.props}
        style={[{ fontFamily: this.getFont(), fontSize: this.getSize(), color: this.getColor() }, this.props.style]}
      />
    );
  }
}
