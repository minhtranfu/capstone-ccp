import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Dimensions,
  Picker,
  TouchableOpacity
} from "react-native";
import { Feather } from "@expo/vector-icons";

import colors from "../config/colors";
import fontSize from "../config/fontSize";

const width = Dimensions.get("window").width;

class Dropdown extends Component {
  static propTypes = {
    defaultText: PropTypes.string,
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
    this.state = {
      pickerValue: props.defaultText || "Please select an option",
      modalVisible: false
    };
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  render() {
    const { options, isHorizontal } = this.props;
    return (
      <View style={{ marginBottom: 20 }}>
        <Modal transparent={true} visible={this.state.modalVisible}>
          <View style={styles.container}>
            <View style={styles.titleContainer}>
              <TouchableOpacity
                style={{
                  alignSelf: "flex-end",
                  marginRight: 15
                }}
                onPress={() => this.setModalVisible(!this.state.modalVisible)}
              >
                <Text style={styles.textDone}>Done</Text>
              </TouchableOpacity>
              <View style={styles.divider} />
              <Picker
                selectedValue={this.state.pickerValue}
                style={{ width: width }}
                onValueChange={(itemValue, itemIndex) => {
                  this.setState({ pickerValue: itemValue });
                  this.props.onSelectValue(itemValue);
                }}
              >
                {options.map(option => (
                  <Picker.Item
                    key={option.id}
                    label={option.name}
                    value={option.name}
                  />
                ))}
              </Picker>
            </View>
          </View>
        </Modal>

        {isHorizontal ? (
          <TouchableOpacity
            style={styles.buttonHorizontal}
            onPress={() => {
              this.setModalVisible(true);
            }}
          >
            <View
              style={{ flex: 2, flexDirection: "row", alignItems: "center" }}
            >
              <Text style={styles.textHorizontal}>{this.props.label}: </Text>
              <Text style={styles.textHorizontal}>
                {this.state.pickerValue}
              </Text>
            </View>
            <Feather name="chevron-right" size={24} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{
              borderBottomColor: colors.secondaryColorOpacity,
              borderBottomWidth: StyleSheet.hairlineWidth
            }}
            onPress={() => {
              this.setModalVisible(true);
            }}
          >
            <Text style={styles.label}>{this.props.label}</Text>
            <Text style={styles.placeholder}>{this.state.pickerValue}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.4)"
  },
  titleContainer: {
    borderRadius: 5,
    width: width,
    height: 260,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white"
  },
  titleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.grayWhite,
    paddingBottom: 10
  },
  textDone: {
    fontWeight: "500",
    fontSize: fontSize.bodyText,
    color: colors.secondaryColor,
    paddingTop: 15,
    paddingBottom: 15
  },
  label: {
    fontSize: fontSize.secondaryText,
    color: colors.text68,
    fontWeight: "400",
    marginTop: 5
  },
  placeholder: {
    fontSize: fontSize.bodyText,
    color: colors.text,
    fontWeight: "400",
    marginBottom: 5,
    marginTop: 15
  },
  textHorizontal: {
    fontSize: fontSize.bodyText,
    color: colors.text,
    fontWeight: "500"
  },
  divider: {
    backgroundColor: "#D8D8D8",
    height: 1,
    width: width
  },
  buttonHorizontal: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.secondaryColorOpacity,
    paddingVertical: 15
  }
});

export default Dropdown;
