import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";

class CustomInput extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      placeholder,
      onSubmitEditing,
      wrapperStyle,
      textStyle,
      ...others
    } = this.props;
    return (
      <View style={[styles.textWrapper, wrapperStyle]}>
        <TextInput
          style={[styles.input, textStyle]}
          placeholder={placeholder}
          placeholderTextColor={"white"}
          returnKeyType={"next"}
          onSubmitEditing={onSubmitEditing}
          autoCapitalize={"none"}
          autoCorrect={false}
          {...others}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textWrapper: {
    flex: 1
  },
  input: {}
});

export default CustomInput;
