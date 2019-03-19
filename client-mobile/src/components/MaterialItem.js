import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "react-native-expo-image-cache";

import colors from "../config/colors";
import fontSize from "../config/fontSize";

class MaterialItem extends Component {
  static propTypes = {
    imageUrl: PropTypes.string,
    name: PropTypes.string,
    manufacturer: PropTypes.string,
    price: PropTypes.string,
    unit: PropTypes.string,
    contractor: PropTypes.string,
    contractorThumbnail: PropTypes.string,
    status: PropTypes.string
  };
  render() {
    const {
      manufacturer,
      name,
      price,
      unit,
      imageUrl,
      contractor,
      contractorThumbnail,
      status,
      onPress
    } = this.props;
    return (
      <TouchableOpacity style={styles.wrapper} onPress={onPress}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image uri={imageUrl} resizeMode={"cover"} style={styles.image} />
          <View style={{ paddingLeft: 15 }}>
            <Text style={styles.text}>{manufacturer}</Text>
            <Text style={styles.text}>{name}</Text>
            <Text style={styles.text}>Price {price}K</Text>
            <Text style={styles.text}>Unit: {unit}</Text>
            <Text style={styles.text}>{contractor}</Text>
            <Image
              uri={contractorThumbnail}
              resizeMode={"cover"}
              style={styles.avatar}
            />
            <Text style={styles.text}>{status}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    shadowColor: "#3E3E3E",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.primaryColor,
    borderRadius: 5
  },
  image: {
    margin: 10,
    width: 100,
    height: 100,
    borderRadius: 5
  },
  avatar: {
    height: 50,
    width: 50,
    borderRadius: 25
  },
  text: {
    fontSize: fontSize.bodyText,
    fontWeight: "500"
  }
});

export default MaterialItem;
