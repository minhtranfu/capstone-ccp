import React, { Component } from "react";
import { View, Text, StyleSheet, Image } from "react-native";

import colors from "../../../config/colors";
import fontSize from "../../../config/fontSize";

class ListVerticalItem extends Component {
  render() {
    const { uploaded, price, style, title } = this.props;
    return (
      <View style={[styles.itemWrapper, style]}>
        <View style={styles.imageWrapper}>
          <Image
            source={require("../../../../assets/images/construction.png")}
            resizeMode={"cover"}
            style={styles.image}
          />
        </View>
        <View style={{ height: 60, paddingHorizontal: 10, justifyContent: 'center' }}>
          <Text style={styles.title}>{title}</Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.text}>{uploaded}</Text>
            <Text style={styles.price}>${price}/w</Text>
          </View>

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  itemWrapper: {
    flex: 1,
    flexDirection: "column",
    height: 160,
    borderRadius: 6,
    ...colors.shadow,
    backgroundColor: 'white',
  },
  imageWrapper: {
    flex: 1,
    width: '100%',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    overflow: 'hidden'
  },
  image: {
    flex: 1,
    width: '100%',
  },
  text: {
    color: colors.text50,
    fontSize: fontSize.caption,
    height: 15,
    flex: 1,
    fontWeight: '500',
  },
  price: {
    color: colors.secondaryColor,
    fontSize: fontSize.caption,
    height: 15,
    fontWeight: '500',
  },
  title: {
    fontSize: fontSize.secondaryText,
    color: colors.primaryColor,
    fontWeight: '500',
  }
});

export default ListVerticalItem;
