import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "react-native-expo-image-cache";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import fontSize from "../config/fontSize";
import colors from "../config/colors";

class DebrisSearchItem extends Component {
  static propTypes = {
    imageUrl: PropTypes.string,
    address: PropTypes.string,
    debrisServiceTypes: PropTypes.array,
    debrisBids: PropTypes.array,
    title: PropTypes.string,
    description: PropTypes.string
  };

  static defaultProps = {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/No_image_3x4.svg/1024px-No_image_3x4.svg.png"
  };

  render() {
    const {
      imageUrl,
      address,
      debrisServiceTypes,
      debrisBids,
      title,
      description,
      onPress
    } = this.props;
    return (
      <TouchableOpacity style={styles.container} onPress={onPress}>
        <View style={styles.wrapper}>
          <Image
            uri={
              imageUrl
                ? imageUrl
                : "https://cdn.japantimes.2xx.jp/wp-content/uploads/2013/01/nn20110630f1b.jpg"
            }
            resizeMode={"cover"}
            style={{ height: 200 }}
          />
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>{title}</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome name={"tags"} size={20} />
              {debrisBids.map(item => (
                <Text style={styles.text}>{item.name}</Text>
              ))}
            </View>
            <Text style={styles.text}>
              <Feather name="map-pin" size={20} />
              {address}
            </Text>
            <Text style={styles.caption}>
              {debrisBids.length > 0 ? debrisBids.length : 0} bids
            </Text>
          </View>
        </View>
      </TouchableOpacity>
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
  wrapper: {
    borderRadius: 10,
    marginHorizontal: 1,
    backgroundColor: "white"
  },
  titleWrapper: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15
  },
  title: {
    fontSize: fontSize.bodyText,
    fontWeight: "bold",
    paddingVertical: 5
  },
  text: {
    fontSize: fontSize.bodyText,
    paddingVertical: 5
  },
  caption: {
    fontSize: fontSize.secondaryText,
    paddingVertical: 5
  }
});

export default DebrisSearchItem;
