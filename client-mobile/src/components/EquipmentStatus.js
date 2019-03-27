import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet } from "react-native";

import colors from "../config/colors";
import fontSize from "../config/fontSize";

const COLORS = {
  AVAILABLE: "#4DB781",
  ACCEPTED: "#4DB781", //green
  DENIED: "#FF5C5C", //red
  CANCEL: "#FF5C5C",
  PENDING: "#F9AA33",
  PROCESSING: "#7199FE",
  DELIVERING: "#7199FE",
  FINISHED: "#FFDF49",
  default: "#3E3E3E"
  // blue: 7199FE, yellow: FFDF49
};

class EquipmentStatus extends Component {
  static propTypes = {
    count: PropTypes.number,
    title: PropTypes.string,
    code: PropTypes.string
  };

  render() {
    const { count, title, code } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.statusTitle}>{title}</Text>
        <View
          style={{
            borderRadius: 20,
            aspectRatio: 1,
            width: 18,
            marginLeft: 5,
            backgroundColor: `${COLORS[code || "default"]}BD`,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text style={styles.statusCount}>{count}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: colors.text50,
    paddingTop: 15,
    paddingBottom: 10,
  },
  statusTitle: {
    color: colors.primaryColor,
    fontSize: fontSize.secondaryText,
    fontWeight: "600",
  },
  statusCount: {
    fontSize: fontSize.caption,
    fontWeight: "500",
    color: "white"
  }
});

export default EquipmentStatus;
