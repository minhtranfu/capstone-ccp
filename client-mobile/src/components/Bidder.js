import React, { Component } from "react";
import PropTypes from "prop-types";
import { Image } from "react-native-expo-image-cache";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Rating } from "react-native-ratings";

import colors from "../config/colors";
import fontSize from "../config/fontSize";

class Bidder extends Component {
  static propTypes = {
    imageUrl: PropTypes.string,
    name: PropTypes.string,
    rating: PropTypes.number,
    phone: PropTypes.string
  };

  static defaultProps = {
    imageUrl:
      "https://microlancer.lancerassets.com/v2/services/bf/56f0a0434111e6aafc85259a636de7/large__original_PAT.jpg"
  };

  _ratingCompleted(rating) {
    console.log("Rating is: " + rating);
  }

  render() {
    const {
      imageUrl,
      name,
      rating,
      phone,
      price,
      description,
      hasDivider,
      onPress
    } = this.props;
    return (
      <TouchableOpacity
        style={{ flexDirection: "row", alignItems: "flex-start" }}
        onPress={onPress}
      >
        <Image
          uri={
            imageUrl
              ? imageUrl
              : "https://microlancer.lancerassets.com/v2/services/bf/56f0a0434111e6aafc85259a636de7/large__original_PAT.jpg"
          }
          resizeMode={"cover"}
          style={{ width: 40, height: 40, borderRadius: 20 }}
        />
        <View style={{ flex: 1, paddingLeft: 15 }}>
          <Text style={styles.text}>{name}</Text>
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
          {phone ? <Text style={styles.text}>Phone: {phone}</Text> : null}
          {price ? <Text style={styles.text}>Bid: {price}</Text> : null}
          {description ? (
            <Text style={styles.text}>Description: {description}</Text>
          ) : null}
          {hasDivider ? <View style={styles.divider} /> : null}
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  divider: {
    height: 1,
    backgroundColor: colors.primaryColor,
    marginVertical: 10
  },
  text: {
    fontSize: fontSize.bodyText,
    fontWeight: "500"
  }
});

export default Bidder;
