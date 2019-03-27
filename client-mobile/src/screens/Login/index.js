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
import { Feather } from "@expo/vector-icons";

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

  _signIn = () => {
    const { username, password } = this.state;
    const { navigation } = this.props;
    this.props.fetchLogin({ username, password });

    navigation.navigate("Account");
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
        <ScrollView
          style={styles.overlay}
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
    marginTop: 60
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
  dividerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
  },
  divider: {
    backgroundColor: "#D8D8D8",
    height: 1,
    flex: 1
  },
  textOr: {
    fontSize: fontSize.secondaryText,
    paddingHorizontal: 8
  },
  wrapperStyle: {
    marginTop: 15,
    marginBottom: 10,
  },
  buttonStyle: {
    borderRadius: 30,
  },
  circleWrapper: {
    flexDirection: "row",

    justifyContent: "center",
    alignItems: "center"
  }
});

export default Login;
