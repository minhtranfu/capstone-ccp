import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated
} from "react-native";
import { SafeAreaView } from "react-navigation";
import { Feather } from "@expo/vector-icons";

import Header from "../../../components/Header";
import InputField from "../../../components/InputField";

import colors from "../../../config/colors";
import fontSize from "../../../config/fontSize";
import { ScrollView } from "react-native-gesture-handler";

class AddDurationText extends Component {
  constructor(props) {
    super(props);
    this.state = {
      valueArray: [],
      duration: [],
      startDate: "",
      endDate: ""
    };

    this.index = 0;
    this.animatedValue = new Animated.Value(0);
  }

  handleAddMore = () => {
    this.animatedValue.setValue(0);
    let newlyAddedValue = { index: this.index };
    this.setState(
      {
        disabled: true,
        valueArray: [...this.state.valueArray, newlyAddedValue]
      },
      () => {
        Animated.timing(this.animatedValue, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true
        }).start(() => {
          this.index = this.index + 1;
          this.setState({ disabled: false });
        });
      }
    );
  };

  render() {
    const { startDate, endDate } = this.state;
    const { data } = this.props.navigation.state.params;
    const timeRange = { startDate, endDate };
    return (
      <SafeAreaView style={styles.container}>
        <Header
          renderLeftButton={() => (
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Feather name="arrow-left" size={24} />
            </TouchableOpacity>
          )}
        >
          <Text>Add Duration</Text>
        </Header>
        <ScrollView>
          <InputField
            label={"From"}
            placeholder={"Input your start date"}
            customWrapperStyle={{ marginBottom: 20, marginHorizontal: 15 }}
            inputType="text"
            onChangeText={value => this.setState({ startDate: value })}
            value={startDate}
            returnKeyType={"next"}
          />
          <InputField
            label={"To"}
            placeholder={"Input your end date"}
            customWrapperStyle={{ marginBottom: 20, marginHorizontal: 15 }}
            inputType="text"
            onChangeText={value => this.setState({ endDate: value })}
            value={endDate}
            returnKeyType={"next"}
          />
        </ScrollView>
        <View style={styles.bottomWrapper}>
          <TouchableOpacity
            style={[styles.buttonWrapper, styles.buttonEnable]}
            onPress={() =>
              this.props.navigation.navigate("AddImage", {
                data: Object.assign({}, data, {
                  availableTimeRanges: [timeRange]
                })
              })
            }
          >
            <Text style={styles.text}>Next</Text>
            <Feather name="chevron-right" size={24} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  bottomWrapper: {
    backgroundColor: "transparent",
    position: "absolute",
    zIndex: 1,
    bottom: 15,
    right: 15,
    justifyContent: "center",
    alignItems: "flex-end"
  },
  buttonWrapper: {
    marginRight: 15,
    width: 80,
    height: 40,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row"
  },
  buttonEnable: {
    backgroundColor: colors.primaryColor
  },
  buttonDisable: {
    backgroundColor: "gray"
  }
});

export default AddDurationText;
