import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image as ImageCache } from "react-native-expo-image-cache";

import fontSize from "../../../config/fontSize";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

class Item extends Component {
  static propTypes = {
    name: PropTypes.string,
    id: PropTypes.number,
    imageURL: PropTypes.string,
    beginDate: PropTypes.string,
    endDate: PropTypes.string,
    status: PropTypes.string
  };

  _formatDate = date => {
    let newDate = new Date(date);
    let year = newDate.getFullYear();
    let month = newDate.getMonth() + 1;
    let newMonth = month < 10 ? "0" + month : month;
    let day = newDate.getDate();
    let newDay = day < 10 ? "0" + day : day;
    let dayOfWeek = weekDays[newDate.getDay()];

    return dayOfWeek + ", " + newDay + "/" + newMonth + "/" + year;
  };

  render() {
    const { name, beginDate, endDate, status, imageURL, onPress } = this.props;
    return (
      <View style={styles.wrapper}>
        <TouchableOpacity onPress={onPress}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <ImageCache
              uri={
                "https://www.extremesandbox.com/wp-content/uploads/Extreme-Sandbox-Corportate-Events-Excavator-Lifting-Car.jpg"
              }
              resizeMode={"cover"}
              style={styles.image}
            />
            <View
              style={{
                flexDirection: "column",
                alignSelf: "flex-start",
                paddingLeft: 10
              }}
            >
              <Text style={[styles.text, { marginBottom: 5 }]}>{name}</Text>
              <Text style={styles.text}>Status: {status}</Text>
            </View>
          </View>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginTop: 10
            }}
          >
            <Text style={styles.text}>
              {this._formatDate(beginDate)} - {this._formatDate(endDate)}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  },
  image: {
    width: 120,
    height: 80,
    borderRadius: 10
  },
  text: {
    fontSize: fontSize.bodyText,
    fontWeight: "500"
  }
});

export default Item;
