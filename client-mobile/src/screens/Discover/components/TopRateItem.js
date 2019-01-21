import React, { Component } from "react";
import { View, Text, StyleSheet, Image } from "react-native";

import colors from "../../../config/colors";
import fontSize from "../../../config/fontSize";

class ListVerticalItem extends Component {
  render() {
    const { uploaded, price } = this.props;
    return (
      <View style={styles.itemWrapper}>
        <Image
          source={require("../../../../assets/images/construction.png")}
          resizeMode={"cover"}
          style={styles.image}
        />
        <Text style={styles.text}>Publish on {uploaded}</Text>
        <Text style={styles.text}>{price} for 1 week</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  itemWrapper: {
    flex: 1,
    flexDirection: "column"
  },
  image: {
    width: 185,
    height: 165,
    borderRadius: 10
  },
  text: {
    color: colors.secondaryColor,
    fontSize: fontSize.secondaryText
  }
});

export default ListVerticalItem;
