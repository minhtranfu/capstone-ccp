import React, { PureComponent } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "react-native-expo-image-cache";
import { Rating } from "react-native-ratings";
import PropTypes from "prop-types";
import Feather from "@expo/vector-icons";

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
            marginBottom: 10
          }}
        >
          <Image
            uri={imageUrl}
            resize={"cover"}
            style={{ width: 50, height: 50, borderRadius: 25, marginLeft: 15 }}
          />
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              paddingLeft: 15
            }}
          >
            <Text style={styles.title}>{this._capitializeLetter(name)}</Text>
            <Text style={styles.text}>{this._capitializeLetter(phone)}</Text>
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
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...colors.shadow
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
