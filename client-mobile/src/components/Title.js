import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

import colors from "../config/colors";
import fontSize from "../config/fontSize";

class Title extends Component {
  render() {
    const { title, hasMore, titleStyle, style } = this.props;
    return (
      <View style={[styles.container, style]}>
        <Text style={[styles.text, titleStyle]}>{title.toUpperCase()}</Text>
        <Text style={styles.hasMoreText}>
          {hasMore ? hasMore || "More" : null}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 5
  },
  text: {
    color: colors.secondaryColor,
    fontSize: fontSize.bodyText,
    fontWeight: "500"
  },
  hasMoreText: {
    color: colors.primaryColor,
    fontSize: fontSize.caption
  }
});

export default Title;
