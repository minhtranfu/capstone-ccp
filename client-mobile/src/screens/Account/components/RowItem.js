import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View, Text, TouchableOpacity, StyleSheet, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import colors from "../../../config/colors";
import fontSize from "../../../config/fontSize";

class RowItem extends PureComponent {
  static propTypes = {
    value: PropTypes.string,
    code: PropTypes.string
  };

  render() {
    const { value, onPress, onSwitchValue, onSwitchChange } = this.props;
    if (value === "Push Notifications")
      return (
        <View style={styles.container}>
          <Text style={styles.text}>{value}</Text>
          <Switch
            value={onSwitchValue}
            onValueChange={value => onSwitchChange(value)}
          />
        </View>
      );
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
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  text: {
    fontSize: fontSize.bodyText,
    fontWeight: "500"
  }
});

export default RowItem;
