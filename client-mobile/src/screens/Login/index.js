import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions,
  TouchableOpacity
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
    const { username, password } = this.state;
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
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "always", top: "always" }}
      >
        <Image
          source={require("../../../assets/images/logo.png")}
          style={styles.logo}
        />
        <View style={styles.tabViewWrapper}>
          <View style={styles.itemTabWrapper}>
            {tabs.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => this._onChangeTab(index)}
                style={[
                  styles.tabButton,
                  activeTab === index ? styles.activeButton : null
                ]}
              >
                <Text
                  style={
                    activeTab === index ? styles.activeText : styles.disableText
                  }
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 15
          }}
        >
          <View style={styles.wrapper}>
            <KeyboardAvoidingView
              style={styles.formWrapper}
              behavior="position"
            >
              {activeTab === 0 ? (
                <LoginForm
                  username={username}
                  password={password}
                  onChangeUsername={value =>
                    this._onChangeText("username", value)
                  }
                  onChangePassword={value =>
                    this._onChangeText("password", value)
                  }
                  onPress={this._signIn}
                />
              ) : (
                <RegisterForm username={username} password={password} />
              )}
            </KeyboardAvoidingView>
          </View>
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
    backgroundColor: "white",
    width: 350,
    padding: 15,
    borderRadius: 15,
    marginVertical: 30
  },
  logo: {
    width: 60,
    height: 60,
    alignSelf: "center"
  },
  wrapperStyle: {
    marginBottom: 10
  },
  activeButton: {
    borderBottomColor: "blue",
    borderBottomWidth: 3
  },
  tabViewWrapper: {
    height: 50,
    shadowColor: "#3E3E3E",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    elevation: 2
  },
  itemTabWrapper: {
    paddingTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white"
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 15
  },
  activeText: {
    color: colors.text,
    fontSize: fontSize.bodyText,
    fontWeight: "bold"
  },
  disableText: {
    color: colors.text50,
    fontSize: fontSize.bodyText,
    fontWeight: "bold"
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

export default Login;
