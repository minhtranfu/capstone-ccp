import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from "react-native-expo-image-cache";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { SafeAreaView } from "react-navigation";

import ParallaxList from '../../components/ParallaxList';
import Loading from '../../components/Loading';

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

class Feedback extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <SafeAreaView style={styles.container} forceInset={{top:'always'}}>
        <Text> textInComponent </Text>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1
  }
});

export default Feedback;
