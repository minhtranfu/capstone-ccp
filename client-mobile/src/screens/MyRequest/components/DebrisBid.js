import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "react-native-expo-image-cache";
import { Rating } from "react-native-ratings";

import colors from "../../../config/colors";
import fontSize from "../../../config/fontSize";

class DebrisBid extends Component {
  static propTypes = {
    description: PropTypes.string,
    price: PropTypes.number,
    rating: PropTypes.number,
    thumbnailUrl: PropTypes.string,
    supplierName: PropTypes.string
  };

  render() {
    const {
      description,
      price,
      rating,
      thumbnailUrl,
      supplierName,
      onPress
    } = this.props;
    return (
      <View style={styles.wrapper}>
        <Image
          uri={
            thumbnailUrl
              ? thumbnailUrl
              : "https://microlancer.lancerassets.com/v2/services/bf/56f0a0434111e6aafc85259a636de7/large__original_PAT.jpg"
          }
          resizeMode={"cover"}
          style={{ width: 30, height: 30, borderRadius: 10 }}
        />
        <View>
          <Text>{supplierName}</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                borderRadius: 10,
                paddingHorizontal: 10,
                backgroundColor: colors.secondaryColor,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 10
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: fontSize.secondaryText
                }}
              >
                {rating}
              </Text>
            </View>
            <Rating
              readonly={true}
              ratingCount={5}
              fractions={1}
              startingValue={rating}
              imageSize={20}
              style={{ paddingVertical: 10 }}
            />
          </View>
          <Text>{price}</Text>
          {description ? <Text>{description}</Text> : null}
          <TouchableOpacity onPress={onPress}>
            <Text>Hire</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row"
  }
});

export default DebrisBid;
