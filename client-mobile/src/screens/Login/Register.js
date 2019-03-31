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

  render() {
    return (
      <SafeAreaView style={styles.container} forceInset={{ top: "always" }}>
        <ScrollView contentContainerStyle={{ paddingHorizontal }}>
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
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default Register;
