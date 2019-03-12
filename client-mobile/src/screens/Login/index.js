import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions,
  AsyncStorage,
  TouchableOpacity,
  StatusBar
} from "react-native";
import { SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import { FontAwesome } from "@expo/vector-icons";

import Header from "../../components/Header";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import CircleIcon from "./CircleIcon";

import { logIn } from "../../redux/actions/auth";
import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

const { width, height } = Dimensions.get("window");

@connect(
  state => {
    return {};
  },
  dispatch => ({
    fetchLogin: user => {
      dispatch(logIn(user));
    }
  })
)
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }

  _signIn = user => {
    const { username, password } = this.state;
    const { navigation } = this.props;
    this.props.fetchLogin({ username, password });
    if (navigation.state.params) {
      const { screen } = navigation.state.params;
      navigation.navigate(screen);
    } else {
      navigation.navigate("Account");
    }
  };

  render() {
    const { username, password } = this.state;
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "always", top: "never" }}
      >
        <StatusBar barStyle="dark-content" />
        <Image
          source={require("../../../assets/images/excavator3.png")}
          resizeMode={"cover"}
          style={{ width: width, height: height }}
        />

        <ScrollView
          style={styles.overlay}
          contentContainerStyle={{
            justifyContent: "center",
            marginTop: 60,
            paddingHorizontal: 15
          }}
        >
          <Header>
            <Image
              source={require("../../../assets/images/logo.png")}
              style={styles.logo}
            />
          </Header>
          <KeyboardAvoidingView style={styles.formWrapper} behavior="position">
            <InputField
              label={"EMAIL ADDRESS"}
              labelStyle={{ color: "white" }}
              placeholder={"Input your username"}
              customWrapperStyle={{ marginBottom: 10 }}
              placeholderStyle={{ borderBottomColor: "white", color: "white" }}
              autoCapitalize={"none"}
              inputType="text"
              placeholderTextColor={"white"}
              onChangeText={value => this.setState({ username: value })}
              value={username}
              returnKeyType={"next"}
            />
            <InputField
              label={"PASSWORD"}
              labelStyle={{ color: "white" }}
              placeholder={"Password"}
              autoCapitalize={"none"}
              customWrapperStyle={{ marginBottom: 10 }}
              placeholderStyle={{ borderBottomColor: "white" }}
              placeholderTextColor={"white"}
              inputType="password"
              onChangeText={value => this.setState({ password: value })}
              value={password}
            />
          </KeyboardAvoidingView>
          <Button
            text={"Login"}
            wrapperStyle={styles.wrapperStyle}
            buttonStyle={styles.buttonStyle}
            textStyle={styles.textStyle}
            onPress={() => this._signIn()}
          />
          <Text style={[styles.text, { alignSelf: "center" }]}>
            Forgot your password?
          </Text>
          <View style={styles.dividerWrapper}>
            <View style={styles.divider} />
            <Text style={styles.textOr}>Or Sign in with</Text>
            <View style={styles.divider} />
          </View>
          <View style={styles.circleWrapper}>
            <CircleIcon name="facebook" />
            <CircleIcon name="twitter" />
            <CircleIcon name="google-plus" />
          </View>
          <Text
            style={[styles.text, { marginVertical: 10, alignSelf: "center" }]}
          >
            Don't Have an Account?
          </Text>
          <Button
            text={"Register Now"}
            wrapperStyle={styles.wrapperStyle}
            buttonStyle={styles.buttonStyle}
            textStyle={styles.textStyle}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  overlay: {
    height: height,
    width: width,
    ...StyleSheet.absoluteFillObject
  },
  formWrapper: {
    flex: 1,
    marginTop: 10
  },
  text: {
    color: colors.white,
    fontSize: fontSize.bodyText,
    fontWeight: "500"
  },
  logo: {
    width: 85,
    height: 52,
    alignSelf: "center"
  },
  title: {
    fontSize: fontSize.bodyText,
    color: colors.primaryColor
  },
  dividerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 30,
    marginVertical: 10
  },
  divider: {
    backgroundColor: "#D8D8D8",
    height: 1,
    flex: 1
  },
  textOr: {
    color: colors.white,
    fontSize: fontSize.secondaryText,
    paddingHorizontal: 8
  },
  wrapperStyle: {
    marginTop: 10,
    marginBottom: 10
  },
  buttonStyle: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.white,
    width: width - 30
  },
  circleWrapper: {
    flexDirection: "row",

    justifyContent: "center",
    alignItems: "center"
  }
});

export default Login;
