import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-navigation";

class SearchResult extends Component {
  render() {
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "never", top: "always" }}
      >
        <Text>SearchResult! </Text>
      </SafeAreaView>
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

export default SearchResult;
