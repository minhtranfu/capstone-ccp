import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  StatusBar
} from "react-native";
import { SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import { logIn } from "../../redux/actions/auth";

import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import InputField from "../../components/InputField";
import Button from "../../components/Button";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";
import { Feather } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const tabs = ["Login", "Register"];

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
      password: "",
      activeTab: 0
    };
  }

  _signIn = () => {
    const { username, password, activeTab } = this.state;
    const { navigation } = this.props;
    this.props.fetchLogin({ username, password });
    navigation.navigate("Account");
  };

  _onChangeTab = tab => {
    this.setState({ activeTab: tab });
  };

  _onChangeText = (field, value) => {
    this.setState({ [field]: value });
  };

  render() {
    const { username, password, activeTab } = this.state;
    const { navigation } = this.props;
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "always", top: "always" }}
      >
        <StatusBar barStyle="dark-content" />
        {/* {navigation.state.params && navigation.state.params.isModal && (
          <TouchableOpacity
            style={{ marginRight: 30, alignSelf: "flex-end", zIndex: 100 }}
            onPress={() => this.props.navigation.goBack()}
          >
            <Feather name="x" size={22} color={colors.primaryColor} />
          </TouchableOpacity>
        )} */}

        <ScrollView
          contentContainerStyle={{
            justifyContent: "center",
            paddingTop: 100,
            paddingHorizontal: 15,
            flexDirection: "column"
          }}
        >
          <View
            style={{
              padding: 0,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row"
            }}
          >
            <View
              style={{
                borderRadius: 3,
                borderWidth: 3,
                borderColor: colors.text68,
                width: 88,
                height: 52,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text
                style={{
                  color: colors.text68,
                  fontWeight: "700",
                  fontSize: 30
                }}
              >
                C<Text style={{ color: colors.secondaryColor }}>C</Text>P
              </Text>
            </View>
          </View>
          <KeyboardAvoidingView style={styles.formWrapper} behavior="position">
            <LoginForm
              username={username}
              password={password}
              onChangeUsername={value => this._onChangeText("username", value)}
              onChangePassword={value => this._onChangeText("password", value)}
              onPress={this._signIn}
            />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={[styles.forgotPassword]}>
                Forgot your password? |
              </Text>
              <TouchableOpacity
                style={{ alignItems: "center" }}
                onPress={() => this.props.navigation.navigate("Register")}
              >
                <Text style={{ color: colors.text68, fontWeight: "600" }}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  wrapper: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    shadowColor: "#3E3E3E",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2
  },
  formWrapper: {
    flex: 1,
    marginTop: 60,
    backgroundColor: "white",
    padding: 10,
    marginVertical: 30
  }
});

export default Login;
