import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

class SearchButton extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View>
        <Text> textInComponent </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  buttonWrapper: {}
});

export default SearchButton;
