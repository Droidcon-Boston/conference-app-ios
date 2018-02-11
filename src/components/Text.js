import { Text as RNText } from "react-native";
import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import Fonts from "../util/Fonts";

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
  render() {
    return (
      <RNText {...this.props} style={[{ fontFamily: this.getFont(), fontSize: this.getSize() }, this.props.style]} />
    );
  }
}
