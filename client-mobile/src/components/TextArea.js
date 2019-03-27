import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, StyleSheet, TextInput } from "react-native";

import fontSize from "../config/fontSize";
import colors from "../config/colors";

class TextArea extends Component {
  static propTypes = {
    numberOfLines: PropTypes.number,
    value: PropTypes.string,
    maxLength: PropTypes.number
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
      placeholderStyle,
      onChangeText
    } = this.props;
    return (
      <TextInput
        style={[styles.placeholder, placeholderStyle]}
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
  placeholder: {
    paddingHorizontal: 15,
    paddingTop: 15,
    height: 200,
    borderColor: colors.text25,
    borderWidth: StyleSheet.hairlineWidth,
    fontSize: fontSize.bodyText,
    color: colors.text,
    fontWeight: "400"
  }
});

export default TextArea;
