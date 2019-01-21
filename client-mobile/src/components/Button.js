import React, { PureComponent } from "react";
import {
  StyleSheet,
  View,
  Platform,
  TouchableOpacity,
  TouchableNativeFeedback,
  Text
} from "react-native";

import colors from "../config/colors";
import fontSize from "../config/fontSize";

const Touchable =
  Platform.OS === "ios" ? TouchableOpacity : TouchableNativeFeedback;

class Button extends PureComponent {
  render() {
    const { onPress, buttonStyle, text, wrapperStyle, textStyle } = this.props;
    return (
      <View style={[styles.btnWrapper, wrapperStyle]}>
        <Touchable onPress={onPress} style={[styles.button, buttonStyle]}>
          <View style={styles.textWrapper}>
            <Text style={[styles.buttonText, textStyle]}>{text}</Text>
          </View>
        </Touchable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  btnWrapper: {
    marginHorizontal: 15,
    marginTop: 20
  },
  button: {
    backgroundColor: colors.primaryColor,
    borderRadius: 10,
    height: 44,
    flex: 1
  },
  textWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonText: {
    color: colors.white,
    fontSize: fontSize.bodyText,
    fontWeight: "500"
  }
});

export default Button;
