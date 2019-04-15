import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated
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
      visible: false,
      y: new Animated.Value(-100)
    };
  }

  show = () => {
    Animated.spring(this.state.y, {
      tension: 10,
      toValue: 5
    }).start();
    this.setState({
      visible: true
    });
  };

  hide = () => {
    Animated.timing(this.state.y, {
      duration: 1000,
      toValue: -100
    }).start();
    // this.setState({
    //   visible: false
    // });
  };

  componentDidMount() {
    setTimeout(() => this.show(), 1000); // show toast after 1s

    setTimeout(() => this.hide(), 4000); // hide toast after 4s
  }

  componentDidUpdate(prevProp) {
    if (prevProp.message !== this.props.message) {
      setTimeout(() => this.show(), 1000); // show toast after 1s

      setTimeout(() => this.hide(), 4000); // hide toast after 4s
    }
  }

  _capitializeLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  render() {
    const { message } = this.props;
    let parts = message.clickAction.split("/");
    return (
      <Modal transparent={true} visible={this.state.visible}>
        <Animated.View
          style={[
            styles.container,
            {
              transform: [
                {
                  translateY: this.state.y
                }
              ]
            }
          ]}
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center"
            }}
            onPress={() => goToNotification()}
          >
            <View>
              <Text style={styles.title}>
                {this._capitializeLetter(parts[0])} #{parts[1]}
              </Text>
              <Text style={styles.text}>{message.title}</Text>
              <Text style={styles.content}>{message.body}</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: width - 6,
    height: 80,
    backgroundColor: "#c8e6c9",
    borderRadius: 8,
    marginHorizontal: 3,
    paddingTop: 20,
    paddingHorizontal: 15,
    ...colors.shadow,
    justifyContent: "center",
    paddingBottom: 10
  },
  title: {
    fontSize: fontSize.bodyText,
    fontWeight: "600",
    color: colors.text
  },
  text: {
    fontSize: fontSize.secondaryText,
    fontWeight: "500",
    color: colors.text
  },
  content: {
    fontSize: fontSize.secondaryText,
    fontWeight: "500",
    color: colors.text68
  }
});

export default ShowToast;
