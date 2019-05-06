import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Image as ImageCache } from "react-native-expo-image-cache";

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

  state = {
    imageFailed: false
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
          activeOpacity={0.9}
        >
          <ImageCache
            uri={
              !this.state.imageFailed
                ? imageUrl
                : "https://vollrath.com/ClientCss/images/VollrathImages/No_Image_Available.jpg"
            }
            style={{ height: 160, backgroundColor: "#e9e9e9" }}
            resizeMode={!this.state.imageFailed ? "cover" : "contain"}
            onError={() => {
              this.setState({ imageFailed: true });
            }}
          />
          <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
            <Text style={[styles.nameText, {}]}>{name}</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <Text style={styles.text}>{manufacturer}</Text>
              <Text
                style={[
                  styles.text,
                  { color: colors.secondaryColor, fontWeight: "600" }
                ]}
              >
                {price}K
              </Text>
            </View>
            <Text
              style={[
                styles.text,
                {
                  paddingBottom: 5,
                  fontSize: fontSize.caption,
                  color: colors.text50
                }
              ]}
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
    ...colors.shadow,
    elevation: 2,
    marginBottom: 20,
    marginTop: 5
  },
  titleWrapper: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: "white"
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
    fontSize: fontSize.bodyText,
    color: colors.text,
    fontWeight: "600",
    marginBottom: 5
  },
  text: {
    fontSize: fontSize.secondaryText,
    color: colors.text68,
    paddingBottom: 5,
    fontWeight: "500"
  }
});

export default MaterialSearchItem;
