import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated
} from "react-native";
import { SafeAreaView } from "react-navigation";
import { Feather, Ionicons } from "@expo/vector-icons";

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
      beginDate: "",
      endDate: ""
    };

    this.index = 0;
    this.animatedValue = new Animated.Value(0);
  }

  _handleOnPressAddMore = () => {
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

  _renderScrollViewItem = () => {
    const { beginDate, endDate } = this.state;
    return (
      <View>
        <InputField
          label={"From"}
          placeholder={"yyyy-mm-dd"}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          onChangeText={value => this.setState({ beginDate: value })}
          value={beginDate}
          returnKeyType={"next"}
        />
        <InputField
          label={"To"}
          placeholder={"yyyy-mm-dd"}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          onChangeText={value => this.setState({ endDate: value })}
          value={endDate}
          returnKeyType={"next"}
        />
      </View>
    );
  };

  _renderBottomButton = (data, timeRange) => (
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
      <Text style={styles.textEnable}>Next</Text>
      <Ionicons
        name="ios-arrow-forward"
        size={23}
        color={"white"}
        style={{ marginTop: 3 }}
      />
    </TouchableOpacity>
  );

  render() {
    const { beginDate, endDate } = this.state;
    const { data } = this.props.navigation.state.params;
    const timeRange = { beginDate, endDate };
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "always", top: "always" }}
      >
        <Header
          renderLeftButton={() => (
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Feather name="arrow-left" size={24} />
            </TouchableOpacity>
          )}
        >
          <Text style={styles.header}>Available time range</Text>
        </Header>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 15 }}>
          {this._renderScrollViewItem()}
        </ScrollView>
        <View style={styles.bottomWrapper}>
          {this._renderBottomButton(data, timeRange)}
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
    paddingBottom: 20,
    justifyContent: "center",
    alignItems: "flex-end"
  },
  buttonWrapper: {
    marginRight: 15,
    paddingVertical: 5,
    width: 80,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row"
  },
  textEnable: {
    fontSize: fontSize.bodyText,
    fontWeight: "500",
    color: "white",
    marginRight: 8
  },
  buttonEnable: {
    backgroundColor: colors.primaryColor
  },
  buttonDisable: {
    backgroundColor: colors.text25
  },
  header: {
    fontSize: fontSize.h4,
    fontWeight: "500",
    color: colors.text
  }
});

export default AddDurationText;
