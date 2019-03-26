import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

import fontSize from "../../../config/fontSize";
import colors from "../../../config/colors";

class ConstructionItem extends PureComponent {
  static propTypes = {
    name: PropTypes.string,
    address: PropTypes.string
  };

  render() {
    const { onPress, onIconPress, name, address } = this.props;
    return (
      <TouchableOpacity onPress={onPress} style={styles.buttonWrapper}>
        <View style={{ flexDirection: "column", justifyContent: "center", flex: 1, }}>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.description}>{address}</Text>
        </View>
        <TouchableOpacity style={styles.iconWrapper} onPress={onIconPress}>
          <Feather name="x" size={20} color={'#9a1637'}/>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: fontSize.bodyText,
    fontWeight: "600",
  },
  description: {
    color: colors.text68,
    fontSize: fontSize.caption,
    fontWeight: "500",
    marginTop: 8,
  },
  buttonWrapper: {
    backgroundColor: 'white',
    flex: 1,
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.text25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  iconWrapper: {
    paddingHorizontal: 8,
  }
});

export default ConstructionItem;
