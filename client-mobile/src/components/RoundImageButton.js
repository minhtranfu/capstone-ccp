import React, { Component } from "react";
import { TouchableOpacity } from "react-native";

class RoundImageButton extends Component {
  render() {
    const { backgroundColor, size, onPress, style } = this.props;

    return (
      <TouchableOpacity
        style={[
          {
            backgroundColor: backgroundColor,
            width: size,
            height: size,
            borderRadius: 50,
            justifyContent: "center",
            alignItems: "center"
          },
          style
        ]}
        onPress={onPress}
      >
        {this.props.children}
      </TouchableOpacity>
    );
  }
}

export default RoundImageButton;
