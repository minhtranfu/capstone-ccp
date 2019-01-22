import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions
} from "react-native";
import { SafeAreaView } from "react-navigation";

import Header from "../../components/Header";
import InputField from "../../components/InputField";
import Button from "../../components/Button";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

const { width, height } = Dimensions.get("window");

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          source={require("../../../assets/images/excavator2.png")}
          resizeMode={"cover"}
          style={{ width: width, height: height }}
        />
        <View style={styles.overlay}>
          <Image
            source={require("../../../assets/images/logo.png")}
            style={styles.logo}
          />
          <KeyboardAvoidingView style={styles.formWrapper}>
            <InputField
              label={"EMAIL ADDRESS"}
              placeholder={"Username"}
              labelTextSize={fontSize.secondaryText}
              labelColor={colors.white}
              textColor={colors.white}
              borderBottomColor={colors.white}
              inputType="email"
              customWrapperStyle={{ marginBottom: 30 }}
            />
            <InputField
              label={"PASSWORD"}
              placeholder={"Password"}
              labelTextSize={fontSize.secondaryText}
              labelColor={colors.white}
              textColor={colors.white}
              borderBottomColor={colors.white}
              inputType="password"
              customWrapperStyle={{ marginBottom: 30 }}
            />
          </KeyboardAvoidingView>
          <Button
            text={"Login"}
            wrapperStyle={styles.wrapperStyle}
            buttonStyle={styles.buttonStyle}
            textStyle={styles.textStyle}
          />
          <Text style={styles.text}>Forgot your password?</Text>
          <View style={styles.dividerWrapper}>
            <View style={styles.divider} />
            <Text style={styles.textOr}>Or Sign in with</Text>
            <View style={styles.divider} />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    width: width,
    height: height,
    justifyContent: "center",
    alignItems: "center"
  },
  formWrapper: {
    width: width - width / 3
  },
  text: {
    color: colors.white,
    fontSize: fontSize.caption,
    fontWeight: "500"
  },
  logo: {
    width: 85,
    height: 52,
    marginVertical: 15
  },
  title: {
    fontSize: fontSize.bodyText,
    color: colors.primaryColor
  },
  dividerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 70,
    marginVertical: 10
  },
  divider: {
    backgroundColor: "#D8D8D8",
    height: 1,
    flex: 1
  },
  textOr: {
    color: colors.white,
    fontSize: fontSize.caption,
    paddingHorizontal: 8
  },
  wrapperStyle: {
    marginTop: 10,
    marginBottom: 10
  },
  buttonStyle: {
    backgroundColor: colors.lightYellow,
    width: width / 2 + 100
  },
  textStyle: {
    fontSize: fontSize.secondaryText,
    color: colors.dark
  }
});

export default Login;
