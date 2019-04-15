import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  View,
  Platform,
  TouchableOpacity,
  TouchableNativeFeedback,
  Text
} from "react-native";
import { withNavigation } from "react-navigation";

import colors from "../config/colors";
import fontSize from "../config/fontSize";

let Touchable =
  Platform.OS === "ios" ? TouchableOpacity : TouchableNativeFeedback;

class Button extends PureComponent {
  static propTypes = {
    text: PropTypes.string,
    disabled: PropTypes.bool,
    bordered: PropTypes.bool,
    disabledOpacity: PropTypes.number
  };

  static defaultProps = {
    bordered: true,
    disabledOpacity: 0.3
  };

  render() {
    const {
      onPress,
      buttonStyle,
      text,
      wrapperStyle,
      textStyle,
      disabled,
      bordered,
      disabledOpacity
    } = this.props;
    return (
      <View style={[styles.btnWrapper, wrapperStyle]}>
        <Touchable
          onPress={onPress}
          style={[
            styles.button,
            buttonStyle,
            {
              opacity: disabled ? disabledOpacity : 1,
              borderRadius: bordered ? 10 : 0
            }
          ]}
          disabled={disabled}
        >
          <View style={styles.textWrapper}>
            <Text style={[styles.buttonText, textStyle]}>{text}</Text>
          </View>
        </Touchable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  btnWrapper: {},
  button: {
    backgroundColor: colors.primaryColor,
    borderRadius: 10,
    height: 44
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

export default withNavigation(Button);
