import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import fontSize from "../config/fontSize";
import colors from "../config/colors";

class TimeRange extends Component {
  static propTypes = {
    beginDate: PropTypes.string,
    endDate: PropTypes.string
  };

  render() {
    const { beginDate, endDate, onPress } = this.props;
    return (
      <TouchableOpacity style={styles.timeRangeWrapper} onPress={onPress}>
        <View style={{ flexDirection: "column", paddingLeft: 10 }}>
          <Text style={styles.text}>Begin date</Text>
          <Text
            style={{
              fontSize: fontSize.secondaryText + 1,
              lineHeight: fontSize.secondaryText + 1
            }}
          >
            {beginDate ? beginDate : "Date"}
          </Text>
        </View>
        <View style={{ flexDirection: "column", paddingLeft: 10 }}>
          <Text style={styles.text}>End date</Text>
          <Text
            style={{
              paddingRight: 10,
              fontSize: fontSize.secondaryText + 1,
              lineHeight: fontSize.secondaryText + 1
            }}
          >
            {endDate ? endDate : "Date"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  timeRangeWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.gray,
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 80
  }
});

export default TimeRange;
