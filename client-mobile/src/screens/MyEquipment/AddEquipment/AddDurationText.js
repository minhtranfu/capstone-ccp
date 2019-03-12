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

import Calendar from "../../../components/Calendar";
import Loading from "../../../components/Loading";
import Header from "../../../components/Header";
import InputField from "../../../components/InputField";

import colors from "../../../config/colors";
import fontSize from "../../../config/fontSize";
import { ScrollView } from "react-native-gesture-handler";

class AddDurationText extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // dateRanges: { 0: { id: 0, beginDate: "", endDate: "" } },
      dataRangeList: [{ id: 0, beginDate: "", endDate: "" }],
      index: 0,
      calendarVisible: false,
      fromDate: "",
      toDate: ""
    };
  }

  _handleAddMore = () => {
    const { beginDate, endDate, index } = this.state;
    // Add new empty data range
    const newRow = {
      id: index + 1,
      beginDate: "",
      endDate: ""
    };

    // Append new data range to dateRanges
    this.setState({
      // dateRanges: {
      //   ...this.state.dateRanges,
      //   [newRow.id]: newRow
      // },
      dataRangeList: [...this.state.dataRangeList, newRow],
      index: index + 1
    });
  };

  _handleRemove = id => {
    // const { dateRanges } = this.state;
    // const newRange = Object.keys(dateRanges).reduce((result, key) => {
    //   if (key !== id.toString()) {
    //     result[key] = dateRanges[key];
    //   }
    //   return result;
    // }, {});
    // //const newRange = delete dateRanges.id;
    // const { [id]: deletedItem, ...otherItems } = dateRanges;
    // this.setState({ dateRanges: otherItems });
    this.setState({
      dataRangeList: this.state.dataRangeList.filter(item => item.id !== id)
    });

    // this.setState({ dateRanges: newRange });
  };

  _handleDateChanged = (id, value, field) => {
    const { dataRangeList, fromDate, toDate } = this.state;
    this.setState({
      // dateRanges: {
      //   ...dateRanges,
      //   [id]: {
      //     ...dateRanges[id],
      //     [field]: value
      //   }
      // },
      dataRangeList: this.state.dataRangeList.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    });
  };

  _onSelectDate = (fromDate, toDate, modalVisible) => {
    console.log(fromDate, toDate);
    const { dataRangeList } = this.state;
    this.setState({
      dataRangeList: this.state.dataRangeList.map(item =>
        item.id === dataRangeList.length - 1
          ? { ...item, beginDate: fromDate, endDate: toDate }
          : item
      ),
      fromDate: fromDate,
      toDate: toDate,
      calendarVisible: false
    });
  };

  _setCalendarVisible = visible => {
    this.setState({ calendarVisible: visible });
  };

  _renderCalendar = (id, beginDate, endDate) => {
    return (
      <Calendar
        visible={this.state.calendarVisible}
        onLeftButtonPress={() => this._setCalendarVisible(false)}
        onSelectDate={this._onSelectDate}
        fromDate={beginDate}
        endDate={endDate}
      />
    );
  };

  _formatDate = date => {
    let newDate = new Date(date);
    let year = newDate.getFullYear();
    let month = newDate.getMonth() + 1;
    let day = newDate.getDate();
    return year + "-" + month + "-" + day;
  };

  _handleDateRange = (date, month) => {
    let today = new Date(date);
    let result = today.setDate(today.getMonth() + month);
    return this._formatDate(result);
  };

  _renderDateRange = item => {
    const { dataRangeList } = this.state;
    const itemId = item.id;
    return (
      <View key={item.id}>
        <TouchableOpacity onPress={() => this._setCalendarVisible(true)}>
          <Text>Select your date range</Text>
        </TouchableOpacity>
        {item.id === 0
          ? this._renderCalendar(
              item.id,
              Date.now(),
              this._handleDateRange(Date.now(), 6)
            )
          : this._renderCalendar(
              item.id,
              dataRangeList[item.id - 1].endDate,
              this._handleDateRange(dataRangeList[item.id - 1].endDate, 6)
            )}

        <InputField
          label={"From"}
          placeholder={"yyyy-mm-dd"}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          onChangeText={value =>
            this._handleDateChanged(itemId, value, "beginDate")
          }
          value={item.beginDate}
          returnKeyType={"next"}
        />
        <InputField
          label={"To"}
          placeholder={"yyyy-mm-dd"}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          onChangeText={value =>
            this._handleDateChanged(itemId, value, "endDate")
          }
          value={item.endDate}
          returnKeyType={"next"}
        />
        {item.id !== 0 ? (
          <TouchableOpacity onPress={() => this._handleRemove(itemId)}>
            <Text>Remove</Text>
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
    const { beginDate, endDate, dataRangeList } = this.state;
    const { data } = this.props.navigation.state.params;
    // const timeRange = { beginDate, endDate };

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
          {this.state.dataRangeList.map(item => this._renderDateRange(item))}

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.buttonPlus}
            onPress={this._handleAddMore}
          >
            <Feather name="plus" size={24} color={"white"} />
          </TouchableOpacity>
        </ScrollView>
        <View style={styles.bottomWrapper}>
          {this._renderBottomButton(data, dataRangeList)}
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
  }
});

export default AddDurationText;
