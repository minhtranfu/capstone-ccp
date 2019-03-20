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
    status: PropTypes.string,
    quantity: PropTypes.string
  };

  _capitalizeFirstLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
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
      onPress,
      quantity
    } = this.props;
    return (
      <TouchableOpacity style={styles.conainter} onPress={onPress}>
        <View style={styles.wrapper}>
          <Image uri={imageUrl} resizeMode={"cover"} style={styles.image} />
          <View style={{ flex: 2 }}>
            <Text
              style={[styles.text, { color: colors.secondaryColorOpacity }]}
            >
              {this._capitalizeFirstLetter(status)}
            </Text>
            <Text style={styles.text} numberOfLines={1}>
              {name}
            </Text>
            <Text style={styles.text} numberOfLines={1}>
              {manufacturer}
            </Text>
            <Text style={styles.text} numberOfLines={1}>
              Quantity: {quantity}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 5,
                marginTop: 5
              }}
            >
              <Image
                uri={contractorThumbnail}
                resizeMode={"cover"}
                style={styles.avatar}
              />
              <Text style={[styles.text, { marginLeft: 10, marginTop: 0 }]}>
                {contractor}
              </Text>
            </View>
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              paddingRight: 10
            }}
          >
            <Text
              style={[
                styles.text,
                { color: colors.secondaryColor, paddingLeft: 15 }
              ]}
            >
              {price} K
            </Text>
            <Text style={styles.text}>
              / {this._capitalizeFirstLetter(unit)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  conainter: {
    flex: 1,
    shadowColor: "#3E3E3E",
    shadowOpacity: 0.3,
    shadowOffset: { width: 1, height: 2 },
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 20
  },
  wrapper: {
    borderRadius: 10,
    marginHorizontal: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white"
  },
  image: {
    marginVertical: 10,
    marginHorizontal: 5,
    width: 100,
    height: 100,
    borderRadius: 5
  },
  avatar: {
    height: 20,
    width: 20,
    borderRadius: 10
  },
  text: {
    fontSize: fontSize.bodyText,
    fontWeight: "500",
    marginTop: 5
  }
});

export default MaterialItem;
