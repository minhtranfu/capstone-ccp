import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "react-native-expo-image-cache";

import colors from "../config/colors";
import fontSize from "../config/fontSize";

class MaterialSearchItem extends PureComponent {
  static propTypes = {
    name: PropTypes.string,
    id: PropTypes.number,
    imageUrl: PropTypes.string,
    manufacturer: PropTypes.string,
    price: PropTypes.number,
    description: PropTypes.string
  };

  static defaultProps = {
    requesterThumbnail:
      "https://drupway.com/wp-content/uploads/2018/10/person-male.png"
  };

  render() {
    const {
      id,
      name,
      imageUrl,
      price,
      onPress,
      manufacturer,
      description
    } = this.props;
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={onPress}
          style={{
            overflow: "hidden",
            borderRadius: 10,
            backgroundColor: "white"
          }}
        >
          <Image uri={imageUrl} style={{ height: 160 }} resizeMode={"cover"} />
          <View style={styles.overlay}>
            <View style={styles.textWrapper}>
              <Text
                style={{
                  fontSize: fontSize.bodyText,
                  fontWeight: "500",
                  color: "white"
                }}
              >
                Material
              </Text>
            </View>
          </View>
          <View
            style={{
              paddingHorizontal: 10,
              borderTopWidth: 0.2,
              borderColor: colors.secondaryColorOpacity
            }}
          >
            <Text style={[styles.nameText, { paddingTop: 10 }]}>{name}</Text>
            <Text style={styles.text}>{manufacturer}</Text>
            <Text style={styles.text}>{price} K VND</Text>
            <Text
              style={[styles.text, { paddingBottom: 10 }]}
              numberOfLines={2}
            >
              {description}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    shadowColor: "#A42A2A",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 20
  },
  titleWrapper: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: "white"
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-end"
  },
  textWrapper: {
    paddingHorizontal: 10,
    marginTop: 10,
    backgroundColor: "gray",
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    height: 30,
    alignItems: "center",
    justifyContent: "center"
  },
  nameText: {
    fontSize: fontSize.h4,
    color: "#484848",
    fontWeight: "500",
    paddingBottom: 5
  },
  text: {
    fontSize: fontSize.bodyText,
    color: "#474747",
    paddingBottom: 5,
    fontWeight: "500"
  }
});

export default MaterialSearchItem;
