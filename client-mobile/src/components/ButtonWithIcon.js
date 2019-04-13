import React, { Component } from "react";
import {
  TouchableOpacity,
  ActionSheetIOS,
  Alert
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
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
      <MaterialIcons
        name="phone"
        size={26}
        color={colors.text}
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
    backgroundColor: colors.secondaryColor,
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
    alignItems: "center",
    justifyContent: "center",
    borderColor: colors.secondaryColor,
    borderBottomWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3
  }
};
export default ButtonWithIcon;
