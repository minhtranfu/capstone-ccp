import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import Feather from "@expo/vector-icons/Feather";
import { getGeneralMaterialType } from "../../../redux/actions/material";

import Dropdown from "../../../components/Dropdown";
import InputField from "../../../components/InputField";
import Loading from "../../../components/Loading";
import Header from "../../../components/Header";

import colors from "../../../config/colors";
import fontSize from "../../../config/fontSize";

class AddMaterialDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "always", top: "always" }}
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

export default AddMaterialDetail;
