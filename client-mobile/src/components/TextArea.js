import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, StyleSheet, TextInput } from "react-native";

import fontSize from "../config/fontSize";
import colors from "../config/colors";

class TextArea extends Component {
  static propTypes = {
    numberOfLines: PropTypes.int,
    value: PropTypes.String,
    maxLength: PropTypes.int
  };

  static defaultProps = {
    numberOfLines: 4,
    maxLength: 100
  };

  render() {
    const {
      numberOfLines,
      value,
      maxLength,
      wrapperStyle,
      onChangeText
    } = this.props;
    return (
      <TextInput
        style={[styles.wrapper, wrapperStyle]}
        multiline={true}
        numberOfLines={numberOfLines}
        onChangeText={onChangeText}
        value={value}
        editable={true}
        maxLength={maxLength}
      />
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    paddingLeft: 10,
    height: 200,
    borderColor: "#000000",
    borderWidth: StyleSheet.hairlineWidth,
    fontSize: fontSize.bodyText,
    color: colors.text,
    fontWeight: "400"
  }
});

export default TextArea;
