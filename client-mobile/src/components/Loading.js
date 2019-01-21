import React, { Component } from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";

import colors from "../config/colors";

class Loading extends Component {
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    textAlign: "center",
    color: colors.secondaryColor,
    fontSize: 20
  }
});

export default Loading;
