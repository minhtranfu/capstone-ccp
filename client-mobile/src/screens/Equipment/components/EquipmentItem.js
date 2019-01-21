import React, { Component } from "react";
import { View, Text, StyleSheet, Image } from "react-native";

import colors from "../../../config/colors";
import fontSize from "../../../config/fontSize";

const config = {
  name: "Xe Nang",
  equipmentId: "51A-2019",
  constructor: "Hoa Binh Constructor",
  price: "150$",
  date: "Fri, Oct 26",
  endDate: "Sun, Nov 11",
  location: "340 Truong Chinh street, Ward 11, HCM city",
  avatar:
    "https://microlancer.lancerassets.com/v2/services/bf/56f0a0434111e6aafc85259a636de7/large__original_PAT.jpg"
};

class EquipmentItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleChangeSort = data => {
    this.setState({
      selectedSort: data
    });
  };

  renderMeetingCalendar = () => {
    return (
      <View style={styles.calendarWrapper}>
        <Text style={styles.day}>26</Text>
        <Text style={styles.month}>Oct</Text>
      </View>
    );
  };

  formatDate = date => {
    var monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    var newDate = new Date(date);
    var day = newDate.getDate();
    var monthIndex = newDate.getMonth();

    return day + " " + monthNames[monthIndex];
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.styleWrapper}>
          <Image
            source={{ uri: config.avatar }}
            style={styles.avatar}
            resizeMode={"cover"}
          />
          <View style={styles.textWrapper}>
            <Text numberOfLines={1} style={styles.name}>
              {config.name}
            </Text>
            <Text numberOfLines={1} style={styles.constructor}>
              {config.constructor}
            </Text>
            <Text numberOfLines={1} style={styles.time}>
              {config.date} - {config.endDate}
            </Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.location}
            >
              {config.location}
            </Text>
          </View>
        </View>
        <View style={{ alignItems: "center", marginRight: 5 }}>
          {this.renderMeetingCalendar(config.date)}
          <Text style={[styles.name, { marginTop: 5 }]}>{config.price}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginHorizontal: 15,
    marginVertical: 5,
    padding: 5,
    borderWidth: 0.5,
    borderColor: colors.secondaryColorOpacity,
    borderRadius: 5
  },
  styleWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center"
  },
  textWrapper: {
    flex: 2,
    flexDirection: "column",
    paddingHorizontal: 5
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36
  },
  name: {
    fontSize: fontSize.secondaryText,
    color: colors.secondaryColor,
    marginTop: 5,
    fontWeight: "bold"
  },
  constructor: {
    fontSize: fontSize.caption,
    color: colors.secondaryColor,
    marginTop: 5,
    fontWeight: "bold"
  },
  time: {
    color: colors.secondaryColorOpacity,
    fontSize: fontSize.secondaryText,
    marginTop: 5
  },
  location: {
    color: colors.primaryColor,
    fontSize: fontSize.secondaryText,
    fontWeight: "500",
    marginTop: 5
  },
  day: {
    color: colors.primaryColor,
    fontWeight: "500",
    fontSize: fontSize.secondaryText
  },
  month: {
    color: colors.primaryColor,
    marginTop: -1,
    fontSize: fontSize.secondaryText
  },
  calendarWrapper: {
    alignItems: "center",
    justifyContent: "center",
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: "#F4F4F4"
  }
});

export default EquipmentItem;
