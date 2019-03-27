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
    const { username, password } = this.state;
    const { navigation } = this.props;
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "always", top: "always" }}
      >
        <StatusBar barStyle="dark-content" />
        {navigation.state.params && navigation.state.params.isModal && (
          <TouchableOpacity style={{marginRight: 30, alignSelf: 'flex-end', zIndex: 100 }} onPress={() => this.props.navigation.goBack()}>
            <Feather name="x" size={22} color={colors.primaryColor}/>
          </TouchableOpacity>
        )}
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
            justifyContent: "center",
            paddingTop: 120,
            paddingHorizontal: 15,
            flexDirection: 'column',
          }}
        >
          <View style={{ padding: 0, alignItems: 'centers', justifyContent: 'center', flexDirection: 'row'}}>
            <View style={{ borderRadius: 3, borderWidth: 3, borderColor: colors.text68, width: 88, height: 52, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: colors.text68, fontWeight: '700', fontSize: 30}}>
                C
                <Text style={{color: colors.secondaryColor}}>C</Text>
                P
              </Text>
            </View>
          </View>
          <KeyboardAvoidingView style={styles.formWrapper} behavior="position">
            <InputField
              label={"Username"}
              placeholder={"Input your username"}
              customWrapperStyle={{ marginBottom: 20 }}
              autoCapitalize={"none"}
              inputType="text"
              onChangeText={value => this.setState({ username: value })}
              value={username}
              returnKeyType={"next"}
            />
            <InputField
              label={"Password"}
              placeholder={"Password"}
              autoCapitalize={"none"}
              customWrapperStyle={{ marginBottom: 20 }}
              inputType="password"
              onChangeText={value => this.setState({ password: value })}
              value={password}
            />
          </KeyboardAvoidingView>
          <Button
            text={"Log in"}
            wrapperStyle={styles.wrapperStyle}
            buttonStyle={styles.buttonStyle}
            textStyle={styles.textStyle}
            onPress={() => this._signIn()}
          />
          <Text style={[styles.forgotPassword, { alignSelf: "center", marginTop: 10, }]}>
            Forgot your password?
            <Text style={{color: colors.text68, fontWeight: '600'}}> | Sign Up</Text>
          </Text>
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
    flex: 1,
    marginTop: 60
    backgroundColor: "white",
    width: 350,
    padding: 15,
    borderRadius: 15,
    marginVertical: 30
  },
  forgotPassword: {
    fontSize: fontSize.caption,
    color: colors.secondaryColor,
  },
  text: {
    fontSize: fontSize.caption,
    color: colors.text68
  },
  title: {
    fontSize: fontSize.bodyText,
    color: colors.primaryColor
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
    marginHorizontal: 20,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 15
  },
  textOr: {
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
  wrapperStyle: {
    marginTop: 15,
    marginBottom: 10,
  title: {
    textAlign: "center",
    fontSize: fontSize.bodyText,
    color: colors.primaryColor,
    fontWeight: "500"
  },
  buttonStyle: {
    borderRadius: 30,
  },
  circleWrapper: {
    flexDirection: "row",

    justifyContent: "center",
    alignItems: "center"
  caption: {
    color: colors.secondaryColor,
    fontSize: fontSize.caption,
    height: 15,
    fontWeight: "500"
  }
});

export default Login;
