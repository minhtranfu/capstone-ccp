import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

import fontSize from "../../../config/fontSize";

class ConstructionItem extends PureComponent {
  static propTypes = {
    name: PropTypes.string,
    address: PropTypes.string
  };

  render() {
    const { onPress, onIconPress, name, address } = this.props;
    return (
      <TouchableOpacity onPress={onPress} style={styles.buttonWrapper}>
        <View style={{ flexDirection: "column", justifyContent: "center" }}>
          <Text>{name}</Text>
          <Text>{address}</Text>
        </View>
        <TouchableOpacity style={styles.iconWrapper} onPress={onIconPress}>
          <Feather name="x" size={24} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  buttonWrapper: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    shadowColor: "#3E3E3E",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
    marginTop: 15,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  iconWrapper: {}
});

export default ConstructionItem;
