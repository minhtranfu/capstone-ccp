import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-navigation";
import { CalendarList as CalendarPeriod } from "react-native-calendars";

import Button from "../components/Button";
import fontSize from "../config/fontSize";
import colors from "../config/colors";

class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFromDatePicked: false,
      isToDatePicked: false,
      markedDates: {},
      fromDate: "",
      endDate: ""
    };
  }

  componentWillUnmount() {
    this._handleClearDate();
  }

  //Find date between from date and to date
  _findDiffDay = (fromDate, toDate) => {
    let firstDate = new Date(fromDate);
    let secondDate = new Date(toDate);
    let oneDay = 24 * 60 * 60 * 1000;
    return Math.round((secondDate.getTime() - firstDate.getTime()) / oneDay);
  };

  //Format date to yyyy-mm-dd
  _handleDateFormat = date => {
    let dateFormat = new Date(date);
    year = dateFormat.getFullYear();
    month = dateFormat.getMonth() + 1;
    dt = dateFormat.getDate();
    if (dt < 10) {
      dt = "0" + dt;
    }
    if (month < 10) {
      month = "0" + month;
    }
    return year + "-" + month + "-" + dt;
  };

  //Add new day
  _handleAddDays = (fromDate, days) => {
    let date = new Date(fromDate);
    let newDate = date.setDate(date.getDate() + days);
    return this._handleDateFormat(newDate);
  };

  _setupStartMarker = day => {
    let markedDates = {
      [day.dateString]: {
        startingDay: true,
        endingDay: true,
        color: "red",
        textColor: "white"
      }
    };
    this.setState({
      isFromDatePicked: true,
      isToDatePicked: false,
      fromDate: day.dateString,
      endDate: "",
      markedDates: markedDates
    });
  };

  _setupMarkedDates = (fromDate, toDate, markedDates) => {
    let range = this._findDiffDay(fromDate, toDate);
    if (range >= 0) {
      if (range == 0) {
        markedDates = {
          [toDate]: {
            color: "red",
            textColor: "white"
          }
        };
      } else {
        for (var i = 1; i <= range; i++) {
          let tempDate = this._handleAddDays(fromDate, i);
          if (i === 1) {
            markedDates[fromDate] = {
              endingDay: false,
              startingDay: true,
              color: "red",
              textColor: "white"
            };
          }
          if (i < range) {
            markedDates[tempDate] = {
              color: "red",
              textColor: "white"
            };
          } else {
            markedDates[tempDate] = {
              endingDay: true,
              color: "red",
              textColor: "white"
            };
          }
        }
      }
    }
    return [markedDates, range];
  };

  _handleDateRangeSelect = day => {
    if (!this.state.fromDate || (this.state.fromDate && this.state.endDate)) {
      this._setupStartMarker(day);
    } else if (!this.state.endDate) {
      let markedDates = { ...this.state.markedDates };

      let [mMarkedDates, range] = this._setupMarkedDates(
        this.state.fromDate,
        day.dateString,
        markedDates
      );
      if (range >= 0) {
        this.setState({
          isFromDatePicked: true,
          isToDatePicked: true,
          markedDates: mMarkedDates,
          endDate: day.dateString
        });
      } else {
        this._setupStartMarker(day);
      }
    }
  };

  _handleClearDate = () => {
    this.setState({
      isFromDatePicked: false,
      isToDatePicked: false,
      markedDates: {},
      fromDate: "",
      endDate: ""
    });
  };

  render() {
    const { minDate, maxDate, onSelectDate } = this.props;
    const { fromDate, endDate } = this.state;
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          flexDirection: "column"
        }}
      >
        <TouchableOpacity onPress={() => this._handleClearDate()}>
          <Text>Clear</Text>
        </TouchableOpacity>
        <CalendarPeriod
          disabledByDefault={true}
          onDayPress={day => {
            this._handleDateRangeSelect(day);
          }}
          hideArrows={true}
          style={styles.calendar}
          current={this._handleDateFormat(Date.now())}
          minDate={
            minDate
              ? this._handleDateFormat(minDate)
              : this._handleDateFormat(Date.now())
          }
          markingType={"period"}
          scrollEnabled={true}
          pastScrollRange={2}
          futureScrollRange={10}
          showScrollIndicator={true}
          theme={{
            calendarBackground: "#333248",
            textSectionTitleColor: "white",
            dayTextColor: "white",
            todayTextColor: "yellow",
            selectedDayTextColor: "white",
            monthTextColor: "white",
            selectedDayBackgroundColor: "#333248",
            textDisabledColor: "gray",
            "stylesheet.calendar.header": {
              week: {
                marginTop: 5,
                flexDirection: "row",
                justifyContent: "space-between"
              }
            }
          }}
          markedDates={this.state.markedDates}
          {...this.props}
        />
        <Button
          text={"Confirm"}
          wrapperStyle={{
            backgroundColor: "white",
            paddingVertical: 10,
            paddingHorizontal: 15,
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0
          }}
          onPress={() => {
            this.props.onSelectDate(fromDate, endDate, false);
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  calendar: {
    borderTopWidth: 1,
    paddingTop: 5,
    borderBottomWidth: 1,
    borderColor: "#eee",
    height: 350
  },
  header: {
    fontSize: fontSize.h4,
    fontWeight: "600",
    textAlign: "center",
    padding: 10
  },
  container: {
    flex: 1
  }
});

export default Calendar;
