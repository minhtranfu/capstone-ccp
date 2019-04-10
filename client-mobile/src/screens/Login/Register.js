import React, { Component } from "react";
import { SafeAreaView } from "react-navigation";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert
} from "react-native";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { register } from "../../redux/actions/auth";

import Logo from "../../components/Logo";
import InputField from "../../components/InputField";
import Button from "../../components/Button";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";
import Feather from "@expo/vector-icons/Feather";

@connect(
  state => ({}),
  dispatch => bindActionCreators({ fetchRegister: register }, dispatch)
)
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

  _showAlert = msg => {
    Alert.alert("Error", msg, [{ text: "OK" }], {
      cancelable: true
    });
  };

  _handleSubmit = () => {
    const {
      confirmPassword,
      password,
      username,
      email,
      phoneNumber,
      name
    } = this.state;

    if (confirmPassword !== password) {
      this._showAlert("Your confirm password not match");
    } else {
      const user = {
        credentials: {
          username,
          password
        },
        contractor: {
          name,
          email,
          phoneNumber,
          thumbnailImageUrl: null
        }
      };
      this.props.navigation.navigate("UploadImage", { user });
      // this.props.fetchRegister(user);
      // console.log(res);
      // this.props.navigation.goBack();
    }
  };

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
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 15,
            paddingTop: 100,
            paddingBottom: 50
          }}
        >
          <KeyboardAvoidingView style={styles.formWrapper} behavior="padding">
            <Logo />
            <InputField
              label={"Username"}
              labelStyle={{ color: colors.text50 }}
              placeholder={"Input your username"}
              customWrapperStyle={{ marginBottom: 10 }}
              placeholderStyle={{ borderBottomColor: colors.text50 }}
              autoCapitalize={"none"}
              inputType="text"
              placeholderTextColor={colors.text50}
              onChangeText={value =>
                this._handleInputChanged("username", value)
              }
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
              onChangeText={value =>
                this._handleInputChanged("password", value)
              }
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
              keyboardType={"email-address"}
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
              keyboardType={"phone-pad"}
              value={phoneNumber}
              returnKeyType={"next"}
            />
            <Button
              text={"Sign Up"}
              wrapperStyle={styles.wrapperStyle}
              buttonStyle={styles.buttonStyle}
              textStyle={styles.textStyle}
              onPress={this._handleSubmit}
            />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={[styles.forgotPassword]}>
                Already have an account? |
              </Text>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <Text style={{ color: colors.text68, fontWeight: "600" }}>
                  Sign In
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
  forgotPassword: {
    fontSize: fontSize.caption,
    color: colors.secondaryColor
  },
  formWrapper: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
    marginVertical: 30
  }
});

export default Register;
