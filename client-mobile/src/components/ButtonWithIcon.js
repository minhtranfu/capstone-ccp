import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Image,
  Platform,
  ActionSheetIOS,
  Alert
} from "react-native";
import { TabBarBottom } from "react-navigation";
import colors from "../config/colors";

const ButtonWithIcon = () => {
  showAlert = () => {
    Alert.alert(
      "0379119567",
      undefined,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed")
        },
        {
          text: "Call us",
          onPress: () => console.log("OK Pressed")
        }
      ],
      { cancelable: false }
    );
  };

  showAction = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "Call Us", "Text us"],
        cancelButtonIndex: 0,
        title: "Need help?",
        message: "Call or text us to get support"
      },
      buttonIndex => {
        if (buttonIndex === 1) {
          return this.showAlert();
        } else if (buttonIndex === 2) {
          return this.showAlert();
        }
      }
    );
  };

  return (
    <TouchableOpacity style={styles.actionButton} onPress={this.showAction}>
      <Image
        source={require("../../assets/icons/phone_ic.png")}
        style={styles.image}
        resizeMode={"contain"}
      />
    </TouchableOpacity>
  );
};

const styles = {
  image: {
    width: 28,
    height: 28
  },
  actionButton: {
    backgroundColor: "#6200EE",
    width: 55,
    height: 55,
    borderRadius: 55 / 2,
    alignItems: "center",
    justifyContent: "center",
    borderColor: colors.secondaryColor,
    borderBottomWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3
  }
};
export default ButtonWithIcon;
