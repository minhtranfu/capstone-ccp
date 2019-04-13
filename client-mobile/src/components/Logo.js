import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

import colors from "../config/colors";
import fontSize from "../config/fontSize";

class Logo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View
        style={{
          padding: 0,
          alignItems: "centers",
          justifyContent: "center",
          flexDirection: "row"
        }}
      >
        <View
          style={{
            borderRadius: 3,
            borderWidth: 3,
            borderColor: colors.text68,
            width: 88,
            height: 52,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text
            style={{
              color: colors.text68,
              fontWeight: "700",
              fontSize: 30
            }}
          >
            C<Text style={{ color: colors.secondaryColor }}>C</Text>P
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default Logo;
