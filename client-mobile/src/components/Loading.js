import React, { Component } from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import {
  BallIndicator,
  BarIndicator,
  DotIndicator,
  MaterialIndicator,
  PacmanIndicator,
  PulseIndicator,
  SkypeIndicator,
  UIActivityIndicator,
  WaveIndicator,
} from 'react-native-indicators';


import colors from "../config/colors";

class Loading extends Component {
  render() {
    return (
      <View style={styles.container}>
        <BarIndicator size={30} color={colors.text} count={5}/>
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
