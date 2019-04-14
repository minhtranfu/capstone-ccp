import React, { PureComponent } from "react";
import {
  View,
  TouchableOpacity,
  TouchableNativeFeedback,
  Text,
  StyleSheet,
  Platform
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const Touchable =
  Platform.OS === "ios" ? TouchableOpacity : TouchableNativeFeedback;

class Circle extends PureComponent {
  render() {
    const { name, onPress } = this.props;
    return (
      <Touchable style={styles.wrapper}>
        <FontAwesome name={name} size={35} />
      </Touchable>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    margin: 10,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#D8D8D8",
    alignItems: "center",
    justifyContent: "center"
  }
});

export default Circle;
