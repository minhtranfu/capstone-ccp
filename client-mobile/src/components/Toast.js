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
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { countNotification } from "../redux/actions/notification";
import { SafeAreaView } from "react-navigation";

import fontSize from "../config/fontSize";
import colors from "../config/colors";

const { width } = Dimensions.get("window");

@connect(
  state => ({}),
  dispatch =>
    bindActionCreators({ fetchCountNotification: countNotification }, dispatch)
)
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
      toValue: 5
    }).start();
    // this.setState({
    //   visible: true
    // });
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
    this.props.fetchCountNotification();
    setTimeout(() => this.show(), 1000); // show toast after 1s

    setTimeout(() => this.hide(), 4000); // hide toast after 3s
  }

  componentDidUpdate(prevProp) {
    if (prevProp.message !== this.props.message) {
      this.props.fetchCountNotification();
      setTimeout(() => this.show(), 1000); // show toast after 1s

      setTimeout(() => this.hide(), 3000); // hide toast after 3s
    }
  }

  _capitializeLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  render() {
    const { message } = this.props;
    console.log(message);
    let parts = message.clickAction.split("/");
    return (
      // <Modal transparent={false} visible={this.state.visible}>
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

      // </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: width - 6,
    height: 100,
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
