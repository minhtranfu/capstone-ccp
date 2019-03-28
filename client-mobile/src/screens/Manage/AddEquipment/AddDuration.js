import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
  ScrollView
} from "react-native";
import { SafeAreaView } from "react-navigation";
import { Feather, Ionicons } from "@expo/vector-icons";

import Calendar from "../../../components/Calendar";
import Loading from "../../../components/Loading";
import Header from "../../../components/Header";
import InputField from "../../../components/InputField";

import colors from "../../../config/colors";
import fontSize from "../../../config/fontSize";

class AddDuration extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      timeRanges: [{}],
      index: 0,
      calendarVisible: false,
      calendarIndex: 0,
      fromDate: "",
      toDate: "",
      endDateRange: ""
    };
  }

  _handleAddMore = () => {
    const { beginDate, endDate, index } = this.state;
    // Add new empty data range
    const newRow = {
      beginDate: "",
      endDate: ""
    };

    this.setState({
      timeRanges: [...this.state.timeRanges, newRow]
    });
  };

  _handleRemove = rowIndex => {
    this.setState({
      timeRanges: this.state.timeRanges.filter(
        (item, index) => index !== rowIndex
      )
    });
  };

  //Confirm date select. If toDate = null, set toDate = fromDate add more 3 months
  _onSelectDate = (id, fromDate, toDate, modalVisible) => {
    const { timeRanges } = this.state;
    if (!timeRanges) {
      timeRanges = [];
    }
    let newToDate = toDate ? toDate : this._handleAddMoreMonth(fromDate, 3);
    timeRanges[id] = {
      beginDate: fromDate,
      endDate: newToDate
    };
    this.setState({
      timeRanges,
      calendarVisible: false
    });
  };

  _showAlert = msg => {
    Alert.alert("Error", msg, [{ text: "OK" }], {
      cancelable: true
    });
  };

  //Open calendar
  _setCalendarVisible = (visible, index) => {
    const { timeRanges, endDateRange } = this.state;
    if (
      index > 0 &&
      !timeRanges[index - 1].endDate &&
      !timeRanges[index - 1].beginDate
    ) {
      this._showAlert("Please select your before time range!!!");
    } else {
      this.setState({
        calendarVisible: visible,
        calendarIndex: index
      });
    }
  };

  _renderCalendar = (id, beginDate, endDate) => {
    const { timeRanges } = this.state;
    return (
      <Calendar
        visible={this.state.calendarVisible}
        onLeftButtonPress={() => this._setCalendarVisible(false)}
        onSelectDate={(fromDate, endDate, visible) =>
          this._onSelectDate(id, fromDate, endDate, visible)
        }
        minDate={
          id > 0
            ? this._handleAddMoreDay(timeRanges[id - 1].endDate, 2)
            : this._formatDate(beginDate)
        }
        maxDate={
          id > 0
            ? this._handleAddMoreMonth(timeRanges[id - 1].endDate, 3)
            : this._formatDate(endDate)
        }
      />
    );
  };

  _formatDate = date => {
    let newDate = new Date(date);
    let year = newDate.getFullYear();
    let month = newDate.getMonth() + 1;
    let newMonth = month < 10 ? "0" + month : month;
    let day = newDate.getDate();
    return year + "-" + newMonth + "-" + day;
  };

  _handleAddMoreDay = (date, day) => {
    let today = new Date(date);
    let result = today.setDate(today.getDate() + day);
    return this._formatDate(result);
  };

  _handleAddMoreMonth = (date, month) => {
    let today = new Date(date);
    let result = today.setMonth(today.getMonth() + month);
    return this._formatDate(result);
  };

  _renderDateRange = (item, index) => {
    const { timeRanges } = this.state;
    return (
      <View key={index}>
        <TouchableOpacity onPress={() => this._setCalendarVisible(true, index)}>
          <Text>Select your date range</Text>
        </TouchableOpacity>

        <InputField
          label={"From"}
          placeholder={"yyyy-mm-dd"}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          value={timeRanges[index].beginDate}
          returnKeyType={"next"}
        />
        <InputField
          label={"To"}
          placeholder={"yyyy-mm-dd"}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          value={timeRanges[index].endDate}
          returnKeyType={"next"}
        />
        {index > 0 ? (
          <TouchableOpacity onPress={() => this._handleRemove(index)}>
            <Text style={styles.textRemove}>Remove</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };

  _renderBottomButton = (data, dateRange) => (
    <TouchableOpacity
      style={[styles.buttonWrapper, styles.buttonEnable]}
      onPress={() =>
        this.props.navigation.navigate("AddImage", {
          data: Object.assign({}, data, {
            availableTimeRanges: dateRange.map(item => {
              delete item.id;
              return item;
            })
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
    const { beginDate, endDate, timeRanges, calendarIndex } = this.state;
    const { data } = this.props.navigation.state.params;
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
          {this.state.timeRanges.map((item, index) =>
            this._renderDateRange(item, index)
          )}
          {this._renderCalendar(
            calendarIndex,
            Date.now(),
            this._handleAddMoreMonth(Date.now(), 3)
          )}

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.buttonPlus}
            onPress={this._handleAddMore}
          >
            <Feather name="plus" size={24} color={"white"} />
          </TouchableOpacity>
        </ScrollView>
        <View style={styles.bottomWrapper}>
          {this._renderBottomButton(data, timeRanges)}
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
  buttonPlus: {
    backgroundColor: "green",
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center"
  },
  header: {
    fontSize: fontSize.h4,
    fontWeight: "500",
    color: colors.text
  },
  textRemove: {
    fontSize: fontSize.bodyText,
    fontWeight: "500",
    color: "red"
  }
});

export default AddDuration;
