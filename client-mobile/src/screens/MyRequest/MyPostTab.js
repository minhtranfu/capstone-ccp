import React, { Component } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { withNavigation } from "react-navigation";
import { connect } from "react-navigation";
import { getDebrisArticleByRequester } from "../../redux/actions/debris";

import Dropdown from "../../components/Dropdown";
import { COLORS } from "../../Utils/Constants";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

@connect()
class MyPostTab extends Component {
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

export default MyPostTab;
