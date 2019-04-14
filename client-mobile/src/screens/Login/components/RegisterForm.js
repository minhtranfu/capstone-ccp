import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet } from "react-native";

import InputField from "../../../components/InputField";
import Button from "../../../components/Button";

import fontSize from "../../../config/fontSize";
import colors from "../../../config/colors";

class RegisterForm extends Component {
  static propTypes = {
    username: PropTypes.string,
    password: PropTypes.string
  };

  render() {
    const {
      username,
      password,
      onPress,
      onChangeUsername,
      onChangePassword
    } = this.props;
    return (
      <View>
        <Text style={styles.title}>Register</Text>
        <InputField
          label={"Username"}
          labelStyle={{ color: colors.text50 }}
          placeholder={"Input your username"}
          customWrapperStyle={{ marginBottom: 10 }}
          placeholderStyle={{ borderBottomColor: colors.text50 }}
          autoCapitalize={"none"}
          inputType="text"
          placeholderTextColor={colors.text50}
          onChangeText={onChangeUsername}
          value={username}
          returnKeyType={"next"}
        />
        <InputField
          label={"Password"}
          labelStyle={{ color: colors.text50 }}
          placeholder={"Password"}
          autoCapitalize={"none"}
          customWrapperStyle={{ marginBottom: 10 }}
          placeholderStyle={{ borderBottomColor: colors.text50 }}
          placeholderTextColor={colors.text50}
          inputType="password"
          onChangeText={onChangePassword}
          value={password}
        />
        <InputField
          label={"Confirm password"}
          labelStyle={{ color: colors.text50 }}
          placeholder={"Password"}
          autoCapitalize={"none"}
          customWrapperStyle={{ marginBottom: 10 }}
          placeholderStyle={{ borderBottomColor: colors.text50 }}
          placeholderTextColor={colors.text50}
          inputType="password"
          onChangeText={onChangePassword}
          value={password}
        />
        <InputField
          label={"Your name"}
          labelStyle={{ color: colors.text50 }}
          placeholder={"Input your first and last name here"}
          customWrapperStyle={{ marginBottom: 10 }}
          placeholderStyle={{ borderBottomColor: colors.text50 }}
          autoCapitalize={"none"}
          inputType="text"
          placeholderTextColor={colors.text50}
          onChangeText={onChangeUsername}
          value={username}
          returnKeyType={"next"}
        />
        <InputField
          label={"Email"}
          labelStyle={{ color: colors.text50 }}
          placeholder={"Input your email"}
          customWrapperStyle={{ marginBottom: 10 }}
          placeholderStyle={{ borderBottomColor: colors.text50 }}
          autoCapitalize={"none"}
          inputType="text"
          placeholderTextColor={colors.text50}
          onChangeText={onChangeUsername}
          value={username}
          returnKeyType={"next"}
        />
        <InputField
          label={"Phone"}
          labelStyle={{ color: colors.text50 }}
          placeholder={"Input your phone number"}
          customWrapperStyle={{ marginBottom: 10 }}
          placeholderStyle={{ borderBottomColor: colors.text50 }}
          autoCapitalize={"none"}
          inputType="text"
          placeholderTextColor={colors.text50}
          onChangeText={onChangeUsername}
          value={username}
          returnKeyType={"next"}
        />
        <Button
          text={"Login"}
          wrapperStyle={styles.wrapperStyle}
          buttonStyle={styles.buttonStyle}
          textStyle={styles.textStyle}
          onPress={onPress}
        />
        <Text style={styles.caption}>Forgot your password?</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  wrapperStyle: {
    marginVertical: 10
  },
  text: {
    fontSize: fontSize.secondaryText,
    color: colors.primaryColor,
    fontWeight: "500"
  },
  title: {
    textAlign: "center",
    fontSize: fontSize.bodyText,
    color: colors.primaryColor,
    fontWeight: "500"
  },
  caption: {
    color: colors.secondaryColor,
    fontSize: fontSize.caption,
    height: 15,
    fontWeight: "500"
  }
});

export default RegisterForm;
