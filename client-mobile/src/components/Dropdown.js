import React, { Component } from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Picker,
  Image as RNImage,
  TouchableOpacity
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Modal from "react-native-modal";
import colors from "../config/colors";
import fontSize from "../config/fontSize";
import Image from "react-native-image-progress";

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

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!_.isEqual(nextProps.options, prevState.options)) {
      console.log("ssss");
      return {
        options: nextProps.options,
        pickerValue: nextProps.options[0].value
      };
    } else return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      pickerValue: props.defaultText || "Please select an option",
      modalVisible: false,
      options: null
    };
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  render() {
    const { options, isHorizontal, style } = this.props;
    return (
      <View
        style={[
          {
            backgroundColor: "#f5f5f7",
            paddingHorizontal: 15,
            paddingVertical: 10,
            borderRadius: 5
          },
          style
        ]}
      >
        <Modal
          isVisible={this.state.modalVisible}
          style={{ margin: 0 }}
          onBackdropPress={() => this.setModalVisible(false)}
        >
          <View style={styles.container} pointerEvents={"box-none"}>
            <View style={styles.titleContainer}>
              <TouchableOpacity
                style={{
                  alignSelf: "flex-end",
                  marginRight: 15
                }}
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}
              >
                <Text style={styles.textDone}>Done</Text>
              </TouchableOpacity>
              <View style={styles.divider} />
              <Picker
                selectedValue={this.state.pickerValue}
                style={{ width, borderTopColor: colors.text25 }}
                onValueChange={(itemValue, itemIndex) => {
                  this.setState({ pickerValue: itemValue });
                  this.props.onSelectValue(itemValue, itemIndex);
                }}
              >
                {options.map(option => (
                  <Picker.Item
                    key={option.id}
                    label={option.name}
                    value={option.value}
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
            <View style={{ flex: 2, flexDirection: "column" }}>
              <Text style={styles.dropdownLabel}>{this.props.label} </Text>
              <Text style={styles.dropdownValue}>{this.state.pickerValue}</Text>
            </View>
            <RNImage
              source={require("../../assets/icons/icons8-mail_filter.png")}
              style={{ width: 22, height: 22 }}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{
              borderBottomColor: colors.text25,
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
    justifyContent: "flex-end"
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
    fontSize: fontSize.secondaryText,
    color: colors.text,
    fontWeight: "500"
  },
  dropdownLabel: {
    fontSize: fontSize.caption,
    color: colors.text50,
    fontWeight: "400",
    marginBottom: 3
  },
  dropdownValue: {
    fontSize: fontSize.bodyText,
    color: colors.text,
    fontWeight: "600"
  },
  divider: {
    backgroundColor: "#D8D8D8",
    height: 1,
    width: width
  },
  buttonHorizontal: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  }
});

export default Dropdown;
