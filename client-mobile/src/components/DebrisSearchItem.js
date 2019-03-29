import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image as RNImage
} from "react-native";
import { Image } from "react-native-expo-image-cache";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import fontSize from "../config/fontSize";
import colors from "../config/colors";

function jsUcfirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

class DebrisSearchItem extends Component {
  static propTypes = {
    address: PropTypes.string,
    debrisServiceTypes: PropTypes.array,
    debrisBids: PropTypes.array,
    title: PropTypes.string,
    description: PropTypes.string
  };

  static defaultProps = {
    imageUrl:
      "https://vollrath.com/ClientCss/images/VollrathImages/No_Image_Available.jpg"
  };

  render() {
    const {
      imageUrl,
      address,
      debrisServiceTypes,
      debrisBids,
      title,
      description,
      status,
      onPress
    } = this.props;
    return (
      <TouchableOpacity style={styles.container} onPress={onPress}>
        <View style={styles.wrapper}>
          <Image
            uri={
              imageUrl
                ? imageUrl
                : "https://vollrath.com/ClientCss/images/VollrathImages/No_Image_Available.jpg"
            }
            resizeMode={"contain"}
            style={{
              height: 140,
              backgroundColor: "#e9e9e9",
              marginTop: -10,
              marginHorizontal: -10
            }}
          />
          <View style={styles.bidWrapper}>
            <Text style={styles.caption}>{debrisBids.length} bids</Text>
          </View>
          <Text style={styles.title}>{title}</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 5,
              marginBottom: 3
            }}
          >
            <Feather
              name={"tag"}
              size={12}
              style={{ marginRight: 3 }}
              color={colors.text50}
            />
            {debrisServiceTypes &&
              debrisServiceTypes.map(item => (
                <Text
                  key={`${item.name || Math.random()}`}
                  style={styles.address}
                >
                  - {item.name}
                </Text>
              ))}
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 5,
              marginBottom: 3
            }}
          >
            <Feather
              name="map-pin"
              size={12}
              style={{ marginRight: 3 }}
              color={colors.text50}
            />
            <Text style={styles.address}>{address}</Text>
          </View>
          {status && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 5,
                marginBottom: 3
              }}
            >
              <RNImage
                source={require("../../assets/icons/icons8-rounded_rectangle.png")}
                style={[
                  styles.statusIcon,
                  { tintColor: colors.status[status || "default"] }
                ]}
                resizeMode={"contain"}
              />
              <Text style={styles.address}>
                {jsUcfirst(status.toLowerCase())}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...colors.shadow,
    elevation: 2,
    marginVertical: 8
  },
  wrapper: {
    borderRadius: 10,
    backgroundColor: "white",
    overflow: "hidden",
    padding: 10
  },
  title: {
    fontSize: fontSize.bodyText,
    fontWeight: "600",
    color: colors.text,
    marginTop: 15
  },
  text: {
    fontSize: fontSize.bodyText
  },
  address: {
    fontSize: fontSize.caption,
    color: colors.text50,
    fontWeight: "500"
  },
  bidWrapper: {
    marginTop: -32,
    height: 25,
    alignSelf: "flex-end",
    backgroundColor: "#0000003D",
    paddingHorizontal: 12,
    justifyContent: "center",
    marginRight: -10
  },
  caption: {
    fontSize: fontSize.secondaryText,
    color: colors.text,
    fontWeight: "500"
  },
  statusIcon: {
    width: 13,
    height: 15,
    tintColor: colors.text50,
    marginRight: 4,
    marginLeft: 1
  }
});

export default DebrisSearchItem;
