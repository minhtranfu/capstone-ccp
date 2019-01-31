import React, { Component } from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CalendarList } from "react-native-calendars";
import Calendar from "react-native-calendar-select";

class ModalCalendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: "",
      endDate: ""
    };
  }

  handleFormatDate = date => {
    year = date.getFullYear();
    month = date.getMonth() + 1;
    dt = date.getDate();
    if (dt < 10) {
      dt = "0" + dt;
    }
    if (month < 10) {
      month = "0" + month;
    }
    return year + "-" + month + "-" + dt;
  };

  handleDateRange = (beginDate, endDate) => {
    var dates = [];
    for (
      var day = new Date(beginDate + 1);
      day < new Date(endDate);
      day.setDate(day.getDate() + 1)
    ) {
      dates.push(this.handleFormatDate(day));
    }

    return dates;
  };

  handleSelectDate = date => {
    if (date && date.dateString) {
      const { onSelectDate } = this.props;
      onSelectDate && onSelectDate(date.dateString);
      return this.setState(() => ({
        selectedDate: date.dateString
      }));
    }
  };

  handleEndDate = date => {
    this.setState({ endDate: date });
  };

  confirmDate = ({ startDate, endDate, startMoment, endMoment }) => {
    this.setState({
      startDate,
      endDate
    });
  };

  render() {
    const { dates, title, visible, handleModalVisible } = this.props;
    const { selectedDate, endDate } = this.state;
    let datesPeriod = {};
    let customI18n = {
      w: ["", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat", "Sun"],
      weekday: [
        "",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      text: {
        start: "Check in",
        end: "Check out",
        date: "Date",
        save: "Confirm",
        clear: "Reset"
      },
      date: "DD / MM" // date format
    };

    //get date range (should refactor)
    dates.map(item =>
      this.handleDateRange(item.beginDate, item.endDate).forEach(day => {
        datesPeriod = {
          ...datesPeriod,
          [day]: {
            textColor: "white",
            selected: true,
            color: "#86DCD2",
            startingDay: true,
            endingDay: true
          }
        };
      })
    );
    let color = {
      subColor: "#f0f0f0"
    };

    console.log(datesPeriod);
    console.log("render na`");
    return (
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={visible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={{ marginTop: 22 }}>
            <View>
              <TouchableOpacity
                onPress={() => {
                  handleModalVisible(!visible);
                }}
              >
                <Text>Hide Modal</Text>
              </TouchableOpacity>
              <Text>Check in date: {selectedDate}</Text>
              <Text>Check out date: {endDate}</Text>
              <Calendar
                i18n="en"
                ref={calendar => {
                  this.calendar = calendar;
                }}
                customI18n={customI18n}
                color={color}
                format="YYYYMMDD"
                minDate="20190110"
                maxDate="20190312"
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                onConfirm={this.confirmDate}
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default ModalCalendar;
