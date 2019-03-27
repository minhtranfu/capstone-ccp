import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { goToNotification } from "../Utils/Helpers";

import fontSize from "../config/fontSize";
import colors from "../config/colors";

const { width } = Dimensions.get("window");

class ShowToast extends Component {
  static propTypes = {
    message: PropTypes.object
  };
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  componentDidMount() {
    setTimeout(
      () =>
        this.setState({
          visible: true
        }),
      2000
    ); // show toast after 1s

    setTimeout(
      () =>
        this.setState({
          visible: false
        }),
      3000
    ); // hide toast after 3s
  }

  componentDidUpdate(prevProp) {
    if (prevProp.message !== this.props.message) {
      setTimeout(
        () =>
          this.setState({
            visible: true
          }),
        2000
      ); // show toast after 1s

      setTimeout(
        () =>
          this.setState({
            visible: false
          }),
        5000
      ); // hide toast after 3s
    }
  }

  render() {
    const { message } = this.props;
    return (
      <Modal transparent={true} visible={this.state.visible}>
        <View style={styles.wrapper}>
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={() => goToNotification()}
          >
            <View>
              <Text style={styles.title}>{message.title}</Text>
              <Text style={styles.text}>{message.body}</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                this.setModalVisible(!this.state.modalVisible);
              }}
            >
              <Feather name={"x"} size={24} />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 15,
    marginHorizontal: 15,
    width: 300,
    height: 100,
    backgroundColor: "#DDDDDD",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5
  },
  title: {
    fontSize: fontSize.h4,
    fontWeight: "500"
  },
  text: {
    fontSize: fontSize.bodyText,
    fontWeight: "500"
  }
});

export default ShowToast;
