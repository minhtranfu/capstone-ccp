import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Image as ImageCache } from "react-native-expo-image-cache";
import { Entypo, Ionicons } from "@expo/vector-icons";
import moment from "moment";

import colors from "../config/colors";
import fontSize from "../config/fontSize";

class MaterialOrder extends Component {
  static propTypes = {
    contractor: PropTypes.string,
    phone: PropTypes.string,
    avatarURL: PropTypes.string,
    address: PropTypes.string,
    totalPrice: PropTypes.number,
    status: PropTypes.string,
    createdTime: PropTypes.string,
    totalOrder: PropTypes.array,
    role: PropTypes.string
  };

  static defaultProsp = {
    avatarURL: "http://bootstraptema.ru/snippets/icons/2016/mia/2.png"
  };

  render() {
    const {
      contractor,
      phone,
      avatarURL,
      address,
      totalPrice,
      createdTime,
      totalOrder,
      status,
      statusBackgroundColor,
      onPress,
      role
    } = this.props;
    return (
      <TouchableOpacity style={styles.container} onPress={onPress}>
        <View style={{ flexDirection: "column", flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <ImageCache
              uri={avatarURL}
              style={styles.avatar}
              resizeMode={"cover"}
            />
            <View
              style={{ flexDirection: "column", marginHorizontal: 8, flex: 1 }}
            >
              <Text style={styles.contractorName}>
                {role}: {contractor}
              </Text>
              {address ? (
                <Text style={styles.address}>Address ▶ {address}</Text>
              ) : null}
            </View>
          </View>
          <View style={{ paddingTop: 10 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={require("../../assets/icons/icons8-calendar.png")}
                style={styles.calendarIcon}
                resizeMode={"contain"}
              />
              <Text style={styles.duration}>Order created from:</Text>
            </View>
            <Text style={styles.date}>
              {moment(createdTime).format("DD/MM/YY")}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 8,
                marginBottom: 3
              }}
            >
              <Image
                source={require("../../assets/icons/icons8-rounded_rectangle.png")}
                style={[
                  styles.statusIcon,
                  { tintColor: statusBackgroundColor }
                ]}
                resizeMode={"contain"}
              />
              <Text style={styles.duration}>{status}</Text>
            </View>
          </View>
        </View>
        <Text
          style={{
            fontSize: fontSize.secondaryText,
            color: colors.secondaryColor,
            fontWeight: "600",
            alignSelf: "center",
            paddingRight: 10
          }}
        >
          {totalPrice.toFixed(2)}K/
          {totalOrder.length > 0 ? totalOrder.length + " items" : 0 + " item"}
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    paddingRight: 0
  },
  avatar: {
    height: 36,
    aspectRatio: 1,
    borderRadius: 15
  },
  startEndDate: {
    fontSize: fontSize.caption,
    color: colors.text,
    fontWeight: "600",
    marginLeft: 15 + 3,
    marginTop: 3
  },
  statusIcon: {
    width: 13,
    height: 15,
    tintColor: colors.text50,
    marginRight: 4,
    marginLeft: 1
  },
  calendarIcon: {
    width: 15,
    aspectRatio: 1,
    tintColor: colors.text50,
    marginRight: 3
  },
  duration: {
    fontSize: fontSize.caption,
    color: colors.text50,
    fontWeight: "500"
  },
  contractorName: {
    fontSize: fontSize.caption,
    color: colors.text,
    fontWeight: "600"
  },
  date: {
    fontSize: fontSize.caption,
    color: colors.text,
    fontWeight: "600",
    marginLeft: 30,
    marginTop: 3
  },
  address: {
    fontSize: fontSize.caption,
    color: colors.text68,
    fontWeight: "500"
    // alignSelf: 'flex-end'
  }
});

export default MaterialOrder;
