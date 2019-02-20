import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-navigation";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

class AddConstruction extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <SafeAreaView
        forceInset={{ bottom: "never", top: "always" }}
        style={styles.container}
      >
        <Text> Add new construction </Text>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default AddConstruction;
