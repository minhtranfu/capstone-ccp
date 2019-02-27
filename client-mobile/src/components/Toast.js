import React from "react";
import { StyleSheet, Animated, NetInfo } from "react-native";
import { Emitter } from "../shared";
import Metrics from "../shared/Metrics";
import Theme from "../shared/Theme";
import Text, { COLORS, SIZES, WEIGHTS } from "./Text";

const HEIGHT = Metrics.header.height + Metrics.status.height;

@connect
class Toast extends React.PureComponent {
  // Static methods
  static success(text) {
    Emitter.emit("SHOW_TOAST_MESSAGE", { message: text, type: "success" });
  }

  static error(text) {
    Emitter.emit("SHOW_TOAST_ERROR", { message: text, type: "error" });
  }

  static info(text) {
    Emitter.emit("SHOW_TOAST_INFO", { message: text, type: "info" });
  }

  state = {
    message: "",
    type: "success"
  };

  offset = new Animated.Value(-HEIGHT);

  opacity = new Animated.Value(0);

  initiated = false;

  componentDidMount() {
    Emitter.on("SHOW_TOAST_MESSAGE", this.displayMessage);
    Emitter.on("SHOW_TOAST_ERROR", this.displayMessage);
    Emitter.on("SHOW_TOAST_INFO", this.displayMessage);
    NetInfo.isConnected.addEventListener(
      "connectionChange",
      this.handleConnectivityChange
    );
  }

  componentWillUnmount() {
    Emitter.rm("SHOW_TOAST_MESSAGE");
    Emitter.rm("SHOW_TOAST_ERROR");
    Emitter.rm("SHOW_TOAST_INFO");
    NetInfo.isConnected.removeEventListener(
      "connectionChange",
      this.handleConnectivityChange
    );
  }

  handleConnectivityChange = isConnected => {
    if (this.initiated && isConnected) {
      Emitter.emit("SHOW_TOAST_INFO", {
        message: "Internet Connected",
        type: "info"
      });
    }
    if (!isConnected) {
      Emitter.emit("SHOW_TOAST_ERROR", {
        message: "No Internet Connection",
        type: "error"
      });
    }
    this.initiated = true;
  };

  displayMessage = ({ message, type }) => {
    window.cancelAnimationFrame(this.frameID);

    this.offset.setValue(HEIGHT * -1);
    this.setState({ message, type });
    this.frameID = window.requestAnimationFrame(() => {
      Animated.sequence([
        Animated.delay(100),
        // Fade In
        Animated.parallel([
          Animated.timing(this.opacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true
          }),
          Animated.timing(this.offset, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true
          })
        ]),

        Animated.delay(1500),
        // Fade Out
        Animated.parallel([
          Animated.timing(this.opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true
          }),
          Animated.timing(this.offset, {
            toValue: HEIGHT * -1,
            duration: 300,
            useNativeDriver: true
          })
        ])
      ]).start();
    });
  };

  _messageColor = () => {
    const { type } = this.state;

    if (type === "success") return Theme.color.green;
    if (type === "info") return Theme.color.blue;
    return Theme.color.red;
  };

  render() {
    const { message } = this.state;
    return (
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateY: this.offset }],
            opacity: this.opacity,
            backgroundColor: this._messageColor()
          }
        ]}
        pointerEvents="none"
      >
        <Text
          size={SIZES.subhead}
          weight={WEIGHTS.regular}
          color={COLORS.text}
          style={styles.message}
        >
          {message}
        </Text>
      </Animated.View>
    );
  }
}

Toast.propTypes = {};

const styles = StyleSheet.create({
  container: {
    height: HEIGHT,
    zIndex: 9999,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0
  },
  message: {
    lineHeight: Metrics.header.height,
    marginTop: Metrics.status.height,
    textAlign: "center",
    color: "white"
  }
});

export default Toast;
