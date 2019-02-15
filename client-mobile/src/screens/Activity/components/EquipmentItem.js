import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";

import colors from "../../../config/colors";
import fontSize from "../../../config/fontSize";

class EquipmentItem extends Component {
  static propTypes = {
    name: PropTypes.string,
    id: PropTypes.number,
    imageURL: PropTypes.string,
    contractor: PropTypes.string,
    phone: PropTypes.string,
    beginDate: PropTypes.string,
    endDate: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

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
      hasRenewButton
    } = this.props;
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.wrapper} onPress={onPress}>
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: imageURL }}
              resizeMode={"cover"}
              style={[styles.image, hasRenewButton ? null : { width: 120 }]}
            />
            {hasRenewButton ? (
              <TouchableOpacity
                style={styles.buttonWrapper}
                onPress={onRenewPress}
              >
                <Ionicons name="ios-calendar" size={20} color={"white"} />
                <Text style={styles.buttonText}>Renew transaction</Text>
              </TouchableOpacity>
            ) : null}
          </View>
          <View style={styles.contentWrapper}>
            <Text style={styles.title}>{name}</Text>
            <View style={styles.rowWrapper}>
              <Text style={styles.text}>Contractor</Text>
              <Text style={styles.text}>{contractor}</Text>
            </View>
            <View style={styles.rowWrapper}>
              <Text style={styles.text}>Phone</Text>
              <Text style={styles.text}>{phone}</Text>
            </View>
            <View style={styles.dateWrapper}>
              <Text style={styles.text}>{beginDate}</Text>
              <Entypo
                name="arrow-right"
                size={20}
                style={{ marginHorizontal: 5 }}
              />
              <Text style={styles.text}>{endDate}</Text>
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
    overflow: "hidden"
  },
  wrapper: {
    flexDirection: "row"
  },
  imageWrapper: {
    flexDirection: "column"
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
    fontSize: fontSize.bodyText
  },
  image: {
    height: 90
  }
});

export default EquipmentItem;
