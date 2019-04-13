import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View, Text, TouchableOpacity, StyleSheet, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import colors from "../../../config/colors";
import fontSize from "../../../config/fontSize";

class SettingItem extends PureComponent {
  static propTypes = {
    value: PropTypes.string,
    code: PropTypes.string,
    status: PropTypes.string
  };

  render() {
    const {
      value,
      onPress,
      onSwitchValue,
      onSwitchChange,
      status,
      onVerifyPress
    } = this.props;
    if (value === "Push notifications")
      return (
        <View style={styles.container}>
          <Text style={styles.text}>{value}</Text>
          <Switch
            value={onSwitchValue}
            onValueChange={value => onSwitchChange(value)}
          />
        </View>
      );
    // if (status === "NOT_VERIFIED") {
    //   return (
    //     <TouchableOpacity style={styles.container} onPress={onVerifyPress}>
    //       <Text style={styles.text}>Verify your account</Text>
    //       <Ionicons name="ios-arrow-forward" size={20} />
    //     </TouchableOpacity>
    //   );
    // }
    return (
      <TouchableOpacity style={styles.container} onPress={onPress}>
        <Text style={styles.text}>{value}</Text>
        <Ionicons name="ios-arrow-forward" size={20} />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.text25
  },
  text: {
    fontSize: fontSize.secondaryText,
    fontWeight: "400"
  }
});

export default SettingItem;
