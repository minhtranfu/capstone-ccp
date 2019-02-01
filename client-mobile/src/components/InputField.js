import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform
} from "react-native";

import colors from "../config/colors";
import fontSize from "../config/fontSize";
import { ACTION_SECURITY_SETTINGS } from "expo/build/IntentLauncherAndroid";

const Touchable =
  Platform.OS === "ios" ? TouchableOpacity : TouchableNativeFeedback;

class InputField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      secureInput: !(props.inputType === "text" || props.inputType === "email")
    };
  }

  toggleShowPassword = () => {
    this.setState({ secureInput: !this.state.secureInput });
  };

  render() {
    const {
      label,
      labelTextSize,
      labelColor,
      textColor,
      borderBottomColor,
      inputType,
      customWrapperStyle,
      autoFocus,
      placeholder,
      autoCapitalize,
      placeholderTextColor,
      ...others
    } = this.props;
    const { secureInput } = this.state;
    const fontSize = labelTextSize || fontSize.bodyText;
    const color = labelColor || colors.white;
    const inputColor = textColor || colors.white;
    const borderBottom = borderBottomColor || "transparent";
    return (
      <View style={[styles.container, customWrapperStyle]}>
        <Text style={[styles.label, { fontSize, color }]}>{label}</Text>
        {inputType === "password" ? (
          <Touchable
            style={styles.showButton}
            onPress={this.toggleShowPassword}
          >
            <Text style={[styles.label, { color }]}>
              {secureInput ? "Show" : "Hide"}
            </Text>
          </Touchable>
        ) : null}
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          autoCorrect={false}
          autoFocus={autoFocus}
          autoCapitalize={autoCapitalize}
          style={[
            styles.inputField,
            { color: inputColor, borderBottomColor: borderBottom }
          ]}
          secureTextEntry={secureInput}
          {...others}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  label: {
    fontWeight: "700",
    marginBottom: 10
  },
  inputField: {
    borderBottomWidth: 1,
    paddingTop: 5,
    paddingBottom: 30
  },
  showButton: {
    position: "absolute",
    right: 15
  }
});

export default InputField;
