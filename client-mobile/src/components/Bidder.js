import React, { Component } from "react";
import PropTypes from "prop-types";
import { Image } from "react-native-expo-image-cache";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import colors from "../config/colors";
import fontSize from "../config/fontSize";

class Bidder extends Component {
  static propTypes = {
    imageUrl: PropTypes.string,
    name: PropTypes.string,
    rating: PropTypes.number,
    phone: PropTypes.string
  };

  render() {
    const { imageUrl, name, rating, phone, onPress } = this.props;
    return (
      <TouchableOpacity
        style={{ flexDirection: "row", alignItems: "center" }}
        onPress={onPress}
      >
        <Image
          uri={imageUrl}
          resizeMode={"cover"}
          style={{ width: 30, height: 30, borderRadius: 10 }}
        />
        <View>
          <Text>{name}</Text>
          <Text>{rating}</Text>
          <Text>{phone}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default Bidder;
