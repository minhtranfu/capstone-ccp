import React, { Component } from "react";
import { SafeAreaView } from "react-navigation";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from "react-native";
import Feather from "@expo/vector-icons/Feather";

import Header from "../../../components/Header";
import InputField from "../../../components/InputField";
import Dropdown from "../../../components/Dropdown";

import fontSize from "../../../config/fontSize";
import colors from "../../../config/colors";

class AddSubscription extends Component {
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
        <Header
          renderLeftButton={() => (
            <TouchableOpacity>
              <Feather name={"x"} size={24} />
            </TouchableOpacity>
          )}
        >
          <Text>Add subscription</Text>
        </Header>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 15 }} />
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

export default AddSubscription;
