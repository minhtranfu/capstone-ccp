import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Image as ImageCache } from "react-native-expo-image-cache";
import { Rating } from "react-native-ratings";

import colors from "../config/colors";
import fontSize from "../config/fontSize";

class EquipmentItem extends PureComponent {
  static propTypes = {
    name: PropTypes.string,
    id: PropTypes.number,
    imageURL: PropTypes.string,
    construction: PropTypes.string,
    address: PropTypes.string,
    requesterThumbnail: PropTypes.string,
    price: PropTypes.number,
    rating: PropTypes.number,
    contractorThumbnail: PropTypes.string
  };

  static defaultProps = {
    requesterThumbnail:
      "https://drupway.com/wp-content/uploads/2018/10/person-male.png"
  };

  state = {
    imageFailed: false
  };

  render() {
    const {
      id,
      name,
      imageURL,
      address,
      price,
      onPress,
      requesterThumbnail,
      contractor,
      contractorThumbnail,
      timeRange,
      rating
    } = this.props;
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={onPress}
          style={{ overflow: "hidden", borderRadius: 10 }}
          activeOpacity={0.9}
        >
          <ImageCache
            uri={
              !this.state.imageFailed
                ? imageURL
                : "https://vollrath.com/ClientCss/images/VollrathImages/No_Image_Available.jpg"
            }
            style={{ height: 160, backgroundColor: "#e9e9e9" }}
            resizeMode={!this.state.imageFailed ? "cover" : "contain"}
            onError={() => {
              this.setState({ imageFailed: true });
            }}
          />
          <View style={styles.titleWrapper}>
            <View style={{ flexDirection: "column" }}>
              <Text style={styles.equipmentName}>{name}</Text>
              {contractor ? (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginVertical: 5
                  }}
                >
                  <ImageCache
                    uri={contractorThumbnail || requesterThumbnail}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      ...colors.shadow,
                      backgroundColor: "white"
                    }}
                    resizeMode={"cover"}
                  />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.text}> {contractor}</Text>
                    <Rating
                      readonly={true}
                      ratingCount={5}
                      fractions={1}
                      startingValue={rating}
                      imageSize={20}
                      style={{ paddingBottom: 10 }}
                    />
                  </View>
                </View>
              ) : null}
              {timeRange ? (
                <Text style={styles.text}>
                  {timeRange.beginDate} ▶ {timeRange.endDate}
                </Text>
              ) : null}

              <Text style={styles.equipmentStatus}>{address}</Text>
            </View>
            <View style={styles.priceWrapper}>
              <Text style={styles.equipmentPrice}>{price}k/d</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...colors.shadow,
    elevation: 2,
    marginBottom: 20
  },
  titleWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: "white"
  },
  equipmentName: {
    fontSize: fontSize.bodyText,
    fontWeight: "600",
    color: colors.text
  },
  equipmentStatus: {
    fontSize: fontSize.secondaryText,
    fontWeight: "400",
    color: colors.text50,
    marginTop: 3,
    marginBottom: 3
  },
  equipmentPrice: {
    fontSize: fontSize.h3,
    fontWeight: "600",
    color: colors.text
  },
  priceWrapper: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white"
  },
  text: {
    fontSize: fontSize.secondaryText,
    fontWeight: "500",
    color: colors.text68
  }
});

export default EquipmentItem;
