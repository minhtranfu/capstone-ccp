import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-navigation";
import { connect } from "react-redux";

import SearchBar from "../../components/SearchBar";
import Loading from "../../components/Loading";
import Header from "../../components/Header";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

class MaterialSearch extends Component {
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

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default MaterialSearch;
