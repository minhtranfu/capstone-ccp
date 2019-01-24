import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Dimensions,
  Picker,
  TouchableOpacity
} from "react-native";

import colors from "../config/colors";
import fontSize from "../config/fontSize";

const width = Dimensions.get("window").width;

const mockData = [
  {
    id: 1,
    name: "Beef"
  },
  {
    id: 2,
    name: "Rich Fish"
  },
  {
    id: 3,
    name: "Lamb"
  },
  {
    id: 4,
    name: "Pasta"
  },
  {
    id: 5,
    name: "Veal"
  }
];

class CustomModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pickerValue: "Select an option",
      modalVisible: false
    };
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  render() {
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
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({ pickerValue: itemValue })
                }
              >
                <Picker.Item label="Java" value="java" />
                <Picker.Item label="JavaScript" value="js" />
              </Picker>
            </View>
          </View>
        </Modal>

        <TouchableOpacity
          style={{
            marginHorizontal: 15,
            borderBottomColor: colors.secondaryColorOpacity,
            borderBottomWidth: 1
          }}
          onPress={() => {
            this.setModalVisible(true);
          }}
        >
          <Text style={styles.label}>{this.props.label}</Text>
          <Text style={styles.placeholder}>{this.state.pickerValue}</Text>
        </TouchableOpacity>
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
    borderBottomWidth: 0.5,
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
    color: colors.secondaryColor,
    fontWeight: "bold"
  },
  placeholder: {
    fontSize: fontSize.caption,
    color: colors.secondaryColorOpacity,
    marginBottom: 5,
    marginTop: 10
  },
  divider: {
    backgroundColor: "#D8D8D8",
    height: 1,
    width: width
  }
});

export default CustomModal;
