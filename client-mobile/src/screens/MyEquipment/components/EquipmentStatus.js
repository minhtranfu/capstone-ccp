import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet } from "react-native";

import colors from "../../../config/colors";
import fontSize from "../../../config/fontSize";

const COLORS = {
  ACCEPTED: "#4DB781", //green
  DENIED: "#FF5C5C", //red
  PENDING: "#F9AA33",
  default: "#3E3E3E"
  // blue: 7199FE, yellow: FFDF49
};

class EquipmentStatus extends Component {
  static propTypes = {
    count: PropTypes.number,
    title: PropTypes.string,
    code: PropTypes.string
  };
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { count, title, code } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.statusTitle}>{title}</Text>
        <View
          style={{
            borderRadius: 10,
            paddingHorizontal: 8,
            backgroundColor: COLORS[code || "default"],
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
    marginBottom: 15,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.text50
  },
  statusTitle: {
    fontSize: fontSize.bodyText,
    fontWeight: "500",
    color: colors.text
  },
  statusCount: {
    fontSize: fontSize.caption,
    fontWeight: "500",
    color: "white"
  }
});

export default EquipmentStatus;
