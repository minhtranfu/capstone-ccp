import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";

import colors from "../../../config/colors";
import fontSize from "../../../config/fontSize";

class EquipmentItem extends Component {
  static propTypes = {
    name: PropTypes.string,
    id: PropTypes.number,
    imageURL: PropTypes.string,
    construction: PropTypes.string,
    price: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { id, name, imageURL, status, price, onPress } = this.props;
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={onPress}
          style={{ overflow: "hidden", borderRadius: 10 }}
        >
          <Image
            source={{ uri: imageURL }}
            style={{ height: 160 }}
            resizeMode={"cover"}
          />
          <View style={styles.titleWrapper}>
            <Text style={styles.equipmentName}>{name}</Text>
            <Text style={styles.equipmentStatus}>{status.toUpperCase()}</Text>
            <View style={styles.priceWrapper}>
              <Text style={styles.equipmentPrice}>{price}$</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    shadowColor: "#3E3E3E",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 20
  },
  titleWrapper: {
    flexDirection: "column",
    justifyContent: "center",
    paddingLeft: 15,
    paddingVertical: 8,
    backgroundColor: "white"
  },
  equipmentName: {
    fontSize: fontSize.h4,
    fontWeight: "500",
    color: colors.text
  },
  equipmentStatus: {
    fontSize: fontSize.body,
    fontWeight: "400",
    color: colors.text50
  },
  equipmentPrice: {
    fontSize: fontSize.h2 - 2,
    fontWeight: "600",
    color: colors.text
  },
  priceWrapper: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: 0,
    bottom: 0,
    zIndex: 1,
    borderTopLeftRadius: 26,
    height: 80,
    width: 120,
    backgroundColor: "white"
  }
});

export default EquipmentItem;
