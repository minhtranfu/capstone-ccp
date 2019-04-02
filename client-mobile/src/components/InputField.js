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
  static defaultProps = {
    editable: true,
    borderBottomWidth: StyleSheet.hairlineWidth,
  };
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
      editable,
      borderBottomWidth,
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
          editable={editable}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          autoCorrect={false}
          autoFocus={autoFocus}
          autoCapitalize={autoCapitalize}
          style={[styles.placeholder, placeholderStyle, {borderBottomColor: editable ? colors.text25 : 'white', borderBottomWidth }]}
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
    fontSize: fontSize.caption,
    color: colors.text50,
    fontWeight: "500",
    marginBottom: 8,
  },
  showLabel: {
    color: colors.secondaryColor,
    fontSize: fontSize.caption,
    height: 15,
    fontWeight: "500"
  },
  placeholder: {
    fontSize: fontSize.bodyText,
    color: colors.text,
    fontWeight: "500",
    marginBottom: 5,
    paddingBottom: 10,
    borderBottomColor: colors.text25,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  showButton: {
    position: "absolute",
    right: 15
  }
});

export default InputField;
