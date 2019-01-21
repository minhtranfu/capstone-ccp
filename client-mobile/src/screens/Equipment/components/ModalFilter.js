import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Dimensions,
  Picker
} from "react-native";

import colors from "../../../config/colors";
import fontSize from "../../../config/fontSize";

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

class ModalFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pickerValue: "Select an option"
    };
  }

  render() {
    return (
      <Modal transparent={true} visible={this.props.modalVisible}>
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text
              style={styles.textDone}
              onPress={() => this.props.setModalVisible(!true)}
            >
              Done
            </Text>
            <Picker
              selectedValue={this.state.pickerValue}
              style={{ width: "80%", height: 175 }}
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
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)"
  },
  titleContainer: {
    borderRadius: 5,
    width: width,
    height: 200,
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
    alignSelf: "flex-end",
    padding: 15
  },
  textTitle: {
    fontSize: fontSize.xmedium,
    color: colors.secondaryColorOpacity,
    fontWeight: "bold"
  }
});

export default ModalFilter;
