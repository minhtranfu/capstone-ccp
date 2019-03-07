import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  KeyboardAvoidingView
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
      labelStyle,
      placeholderStyle,
      inputType,
      customWrapperStyle,
      autoFocus,
      placeholder,
      autoCapitalize,
      placeholderTextColor,
      showLabelStyle,
      ...others
    } = this.props;
    const { secureInput } = this.state;
    return (
      <View style={[styles.container, customWrapperStyle]}>
        <Text style={[styles.label, labelStyle]}>{label}</Text>
        {inputType === "password" ? (
          <Touchable
            style={styles.showButton}
            onPress={this.toggleShowPassword}
          >
            <Text style={[styles.showLabel, showLabelStyle]}>
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
          style={[styles.placeholder, placeholderStyle]}
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
    fontSize: fontSize.secondaryText,
    color: colors.text68,
    fontWeight: "400",
    marginTop: 5
  },
  showLabel: {
    fontSize: fontSize.caption,
    color: colors.primaryColor,
    fontWeight: "300",
    marginTop: 5
  },
  placeholder: {
    fontSize: fontSize.bodyText,
    color: colors.text,
    fontWeight: "400",
    marginBottom: 5,
    marginTop: 15,
    paddingBottom: 5,
    borderBottomColor: colors.secondaryColorOpacity,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  showButton: {
    position: "absolute",
    right: 15
  }
});

export default InputField;
