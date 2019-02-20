import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-navigation";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

class Delivery extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "never", top: "always" }}
      >
        <Text> textInComponent </Text>
      </SafeAreaView>
    );
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default Delivery;
