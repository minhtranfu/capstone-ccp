import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from "react-native";
import { Image } from "react-native-expo-image-cache";

import Title from "./Title";

import fontSize from "../config/fontSize";
import colors from "../config/colors";

const { width } = Dimensions.get("window");

class componentName extends Component {
  static propTypes = {
    imageUrl: PropTypes.string,
    name: PropTypes.string,
    manufacturer: PropTypes.string,
    contractor: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    address: PropTypes.string,
    contractorAvatarUrl: PropTypes.stirng,
    price: PropTypes.string,
    unit: PropTypes.string,
    description: PropTypes.string,
    quantity: PropTypes.number
  };
  render() {
    const {
      imageUrl,
      name,
      manufacturer,
      contractor,
      contractorAvatarUrl,
      price,
      unit,
      description,
      email,
      phone,
      address,
      quantity
    } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.imageWrapper}>
          <Image uri={imageUrl} resizeMode={"cover"} style={styles.image} />
        </View>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.text}>{manufacturer}</Text>
        <Text style={styles.text}>
          Price: {price} K/{unit}
        </Text>
        <Text style={styles.text}>Quantity: {quantity}</Text>
        <Text style={[styles.text, { marginBottom: 0 }]}>
          Total price: {price * quantity}K VND
        </Text>
        <Title title={"Description"} />
        <Text style={styles.description}>{description}</Text>
        <View style={styles.divider} />
        {/* <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <Image
            uri={contractorAvatarUrl}
            resizeMode={"cover"}
            style={styles.avatar}
          />
          <View style={{ paddingLeft: 10 }}>
            <Text style={styles.text}>{contractor}</Text>
            <Text style={styles.text}>{email}</Text>
            <Text style={styles.text}>{phone}</Text>
          </View>
        </TouchableOpacity> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  imageWrapper: {
    height: 200,
    shadowColor: "#3E3E3E",
    shadowOpacity: 0.3,
    shadowOffset: { width: 1, height: 2 },
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 20,
    marginTop: 10
  },
  image: {
    height: 200,
    borderRadius: 15
  },
  header: {
    fontSize: fontSize.h4,
    fontWeight: "500"
  },
  title: {
    fontSize: fontSize.bodyText,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 5
  },
  text: {
    fontSize: fontSize.secondaryText,
    fontWeight: "500",
    marginVertical: 5
  },
  description: {
    fontSize: fontSize.secondaryText,
    color: colors.text50,
    fontWeight: "500",
    marginVertical: 5
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  divider: {
    height: 0.5,
    paddingHorizontal: 10,
    backgroundColor: "#B2B2B2",
    marginVertical: 10
  }
});

export default componentName;
