import React, { Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import PropTypes from 'prop-types';
import { Image } from "react-native-expo-image-cache";

import fontSize from "../../../config/fontSize";
import colors from "../../../config/colors";

class EquipmentItem extends Component {
  static propTypes ={ 

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    paddingRight: 0,
  },
  avatar: {
    height: 36,
    aspectRatio: 1,
    borderRadius: 15
  },
  contractorName: {
    fontSize: fontSize.caption,
    color: colors.text,
    fontWeight: "600",
  },
  equipmentName: {
    fontSize: fontSize.caption,
    color: colors.text68,
    fontWeight: "500",
    // alignSelf: 'flex-end'
  },
  equipmentThumbnailWrapper: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    marginVertical: -10,
    overflow: 'hidden'
  },
  equipmentThumbnail: {
    width: 90,
    flex: 1,
  },
  calendarIcon: {
    width: 15,
    aspectRatio: 1,
    tintColor: colors.text50,
    marginRight: 3
  },
  duration: {
    fontSize: fontSize.caption,
    color: colors.text50,
    fontWeight: "500",
  },
  startEndDate: {
    fontSize: fontSize.caption,
    color: colors.text,
    fontWeight: "600",
    marginLeft: 15 + 3,
    marginTop: 3,
  },
});

export default EquipmentItem;
