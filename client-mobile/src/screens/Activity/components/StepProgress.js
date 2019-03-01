import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions
} from "react-native";
import { Feather } from "@expo/vector-icons";

import colors from "../../../config/colors";
import fontSize from "../../../config/fontSize";

const { width } = Dimensions.get("window");

const COLORS = {
  AVAILABLE: "#4DB781",
  ACCEPTED: "#4DB781", //green
  DENIED: "#FF5C5C", //red
  CANCEL: "#FF5C5C",
  PENDING: "#F9AA33",
  PROCESSING: "#7199FE",
  FINISHED: "#FFDF49",
  default: "#3E3E3E"
  // blue: 7199FE, yellow: FFDF49
};

const EQUIPMENT_IN_PROGRESS = {
  PENDING: "Wait for supplier accept",
  ACCEPTED: "Supplier has been accepted",
  DENIED: "Supplier has been denied your transaction",
  PROCESSING: "Equipment is on delivering",
  FINISHED: "Equipment has been returned"
};

class StepProgress extends Component {
  static propTypes = {
    status: PropTypes.string,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        value: PropTypes.string
      })
    ).isRequired
  };
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { status, options, equipmentStatus } = this.props;
    return (
      <View style={styles.container}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 15,
              height: 15,
              backgroundColor: COLORS[status || "default"]
            }}
          />
          <Text style={styles.text}>
            Status: {EQUIPMENT_IN_PROGRESS[status]}
          </Text>
        </View>
        <View style={styles.rowWrapper}>
          {options.map((step, index) => (
            <View
              key={index}
              style={[
                styles.itemWrapper,
                { width: (width - 30) / options.length }, // width - padding Horizontal 15
                step.value === status
                  ? { backgroundColor: COLORS[status || "default"] }
                  : null
              ]}
            >
              <Text style={styles.text}>{step.name}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10
  },
  rowWrapper: {
    flexDirection: "row",
    alignItems: "center"
  },
  itemWrapper: {
    marginTop: 10,
    height: 35,

    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    fontSize: fontSize.bodyText,
    fontWeight: "500"
  }
});

export default StepProgress;
