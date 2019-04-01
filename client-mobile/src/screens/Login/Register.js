import React, { Component } from "react";
import { SafeAreaView } from "react-navigation";
import { View, Text, StyleSheet, ScrollView } from "react-native";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";
import Feather from "@expo/vector-icons/Feather";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      confirmPassword: "",
      name: "",
      email: "",
      phoneNumber: ""
    };
  }

  _handleInputChanged = (field, value) => {
    this.setState({ [field]: value });
  };

  _handleSubmit = () => {};

  render() {
    const {
      username,
      password,
      confirmPassword,
      name,
      email,
      phoneNumber
    } = this.state;
    return (
      <SafeAreaView style={styles.container} forceInset={{ top: "always" }}>
        <ScrollView contentContainerStyle={{ paddingHorizontal }}>
          <InputField
            label={"Username"}
            labelStyle={{ color: colors.text50 }}
            placeholder={"Input your username"}
            customWrapperStyle={{ marginBottom: 10 }}
            placeholderStyle={{ borderBottomColor: colors.text50 }}
            autoCapitalize={"none"}
            inputType="text"
            placeholderTextColor={colors.text50}
            onChangeText={value => this._handleInputChanged("username", value)}
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
            onChangeText={value => this._handleInputChanged("password", value)}
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
            onChangeText={value =>
              this._handleInputChanged("confirmPassword", value)
            }
            value={confirmPassword}
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
            onChangeText={value => this._handleInputChanged("name", value)}
            value={name}
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
            onChangeText={value => this._handleInputChanged("email", value)}
            value={email}
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
            onChangeText={value =>
              this._handleInputChanged("phoneNumber", value)
            }
            value={phoneNumber}
            returnKeyType={"next"}
          />
          <Button
            text={"Sign Up"}
            wrapperStyle={styles.wrapperStyle}
            buttonStyle={styles.buttonStyle}
            textStyle={styles.textStyle}
            onPress={onPress}
          />
          <Text
            style={[
              styles.forgotPassword,
              { alignSelf: "center", marginTop: 10 }
            ]}
          >
            Already have an account?
            <Text style={{ color: colors.text68, fontWeight: "600" }}>
              {" "}
              | Sign In
            </Text>
          </Text>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  forgotPassword: {
    fontSize: fontSize.caption,
    color: colors.secondaryColor
  }
});

export default Register;
