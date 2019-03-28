import React, { Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "react-native-expo-image-cache";

import fontSize from "../../../config/fontSize";
import colors from "../../../config/colors";

class EquipmentItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <TouchableOpacity
        key={item.id}
        style={{
          flex: 1,
          flexDirection: "row",
          backgroundColor: "white",
          borderRadius: 10,
          paddingHorizontal: 10,
          paddingVertical: 10,
          paddingRight: 0
        }}
      >
        <Image uri={item.equipment.equipmentImages} />
        <Text style={styles.text}>{item.equipment.name}</Text>
        <Text style={styles.text}>{item.equipment.address}</Text>
        <TouchableOpacity
          onPress={() => this._handleRemoveItem(user.contractor.id, item.id)}
        >
          <Feather name={"x"} size={24} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }
}

export default EquipmentItem;
