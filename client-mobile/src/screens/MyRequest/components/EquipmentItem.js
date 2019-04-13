import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Image as ImageCache } from "react-native-expo-image-cache";
import { Entypo, Ionicons } from "@expo/vector-icons";

import colors from "../../../config/colors";
import fontSize from "../../../config/fontSize";

class EquipmentItem extends PureComponent {
  static propTypes = {
    name: PropTypes.string,
    id: PropTypes.number,
    imageURL: PropTypes.string,
    contractor: PropTypes.string,
    phone: PropTypes.string,
    beginDate: PropTypes.string,
    endDate: PropTypes.string
  };

  render() {
    const {
      id,
      name,
      imageURL,
      contractor,
      phone,
      beginDate,
      endDate,
      onPress,
      onRenewPress,
      hasRenewButton,
      status,
      statusBackgroundColor,
      avatarURL
    } = this.props;
    return (
      <View style={styles.container}>
        <TouchableOpacity style={{ flexDirection: "column" }} onPress={onPress}>
          <View style={styles.wrapper}>
            <Image
              source={{ uri: imageURL }}
              resizeMode={"cover"}
              style={[styles.image, { width: 120 }]}
            />
            <View style={styles.contentWrapper}>
              <View
                style={[
                  styles.statusWrapper,
                  { backgroundColor: statusBackgroundColor }
                ]}
              >
                <Text style={styles.statusText}>{status}</Text>
              </View>
              <Text style={styles.title} numberOfLines={1}>
                {name}
              </Text>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.text}>{contractor}</Text>
              </View>
            </View>
            <ImageCache
              uri={avatarURL}
              style={styles.avatar}
              resizeMode={"cover"}
            />
          </View>
          <View style={styles.dateWrapper}>
            <Text style={styles.text}>
              {beginDate} - {endDate}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  wrapper: {
    flexDirection: "row"
  },
  contentWrapper: {
    flex: 2,
    flexDirection: "column",
    paddingLeft: 10
  },
  rowWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 5
  },
  dateWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 15
  },
  statusWrapper: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    height: 30,
    width: 90,
    paddingHorizontal: 5,
    paddingVertical: 5
  },
  buttonWrapper: {
    height: 40,
    backgroundColor: colors.primaryColor,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    paddingHorizontal: 5
  },
  buttonText: {
    fontSize: fontSize.secondaryText,
    fontWeight: "500",
    paddingLeft: 5,
    color: "white"
  },
  title: {
    fontSize: fontSize.h4,
    fontWeight: "500",
    paddingTop: 5
  },
  text: {
    fontSize: fontSize.bodyText,
    fontWeight: "500"
  },
  statusText: {
    fontSize: fontSize.secondaryText,
    fontWeight: "bold"
  },
  image: {
    height: 90
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25
  }
});

export default EquipmentItem;
