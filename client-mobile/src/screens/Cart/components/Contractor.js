import React, { PureComponent } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "react-native-expo-image-cache";
import { Rating } from "react-native-ratings";
import PropTypes from "prop-types";
import Feather from "@expo/vector-icons/Feather";

import colors from "../../../config/colors";
import fontSize from "../../../config/fontSize";

class Contractor extends PureComponent {
  static propTypes = {
    name: PropTypes.string,
    rating: PropTypes.number,
    phone: PropTypes.string,
    imageUrl: PropTypes.string
  };

  _capitializeLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  render() {
    const { imageUrl, name, rating, phone } = this.props;
    return (
      <TouchableOpacity style={styles.container}>
        <View
          style={{
            backgroundColor: "white",
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 15,
            justifyContent: "space-between"
          }}
        >
          <Image
            uri={imageUrl}
            resize={"cover"}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              ...colors.shadow
            }}
          />
          <View
            style={{
              flex: 2,
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              paddingLeft: 10
            }}
          >
            <Text style={styles.title}>{this._capitializeLetter(name)}</Text>
            {/* <Text style={styles.text}>{this._capitializeLetter(phone)}</Text> */}
            <Rating
              readonly={true}
              ratingCount={5}
              fractions={1}
              startingValue={rating}
              imageSize={20}
              style={{
                backgroundColor: "transparent",
                alignItems: "flex-start"
              }}
            />
          </View>
          <Feather name="chevron-right" size={24} />
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.primaryColor
    //...colors.shadow
  },
  title: {
    fontSize: fontSize.bodyText,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 5
  },
  text: {
    fontSize: fontSize.secondaryText,
    fontWeight: "400",
    color: colors.text,
    marginBottom: 5
  }
});

export default Contractor;
