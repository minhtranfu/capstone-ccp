import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";

class Search extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Search! </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});

export default Search;
