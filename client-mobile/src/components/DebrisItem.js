import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Entypo from "@expo/vector-icons/Entypo";

import colors from "../config/colors";
import fontSize from "../config/fontSize";

class DebrisItem extends Component {
  static propTypes = {
    title: PropTypes.string,
    address: PropTypes.string,
    debrisServiceTypes: PropTypes.array,
    debrisBids: PropTypes.array,
    price: PropTypes.number
  };

  render() {
    const {
      title,
      address,
      debrisBids,
      debrisServiceTypes,
      price,
      onPress
    } = this.props;
    return (
      <TouchableOpacity style={styles.conainter} onPress={onPress}>
        <View style={styles.wrapper}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.text}>{address}</Text>
          {debrisServiceTypes ? (
            <View style={styles.rowWrapper}>
              <FontAwesome name={"tags"} size={18} style={{ marginRight: 3 }} />
              {debrisServiceTypes.length > 0 ? (
                debrisServiceTypes.map(item => (
                  <Text style={styles.text}>
                    <Entypo name={"dot-single"} size={5} /> {item.name}
                  </Text>
                ))
              ) : (
                <Text style={styles.text}>No tags</Text>
              )}
            </View>
          ) : null}

          <View style={styles.rowWrapper}>
            {debrisBids ? (
              <Text style={styles.caption}>
                {debrisBids && debrisBids.length > 0 ? debrisBids.length : 0}{" "}
                bids
              </Text>
            ) : null}

            {price ? <Text style={styles.caption}>{price}</Text> : null}
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
  rowWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center"
  },
  wrapper: {
    borderRadius: 10,
    marginHorizontal: 1,
    padding: 10,
    justifyContent: "center",
    backgroundColor: "white"
  },
  title: {
    fontSize: fontSize.bodyText,
    fontWeight: "bold"
  },
  text: {
    fontSize: fontSize.bodyText
  },
  caption: {
    fontSize: fontSize.caption,
    fontWeight: "500",
    color: "gray"
  }
});

export default DebrisItem;
