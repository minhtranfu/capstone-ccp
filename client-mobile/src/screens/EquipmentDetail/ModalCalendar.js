import React, { Component } from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CalendarList } from "react-native-calendars";
import Calendar from 'react-native-calendar-select';

class ModalCalendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: [],
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

  render() {
    const { dates, title, visible, handleModalVisible } = this.props;
    const { selectedDate, endDate } = this.state;
    let datesPeriod = {};

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
              <CalendarList
                onDayPress={this.handleSelectDate}
                onDayLongPress={this.handleEndDate}
                markedDates={{
                  [selectedDate]: {
                    selected: true,
                    color: "red",
                    textColor: "white",
                    startingDay: true
                  },
                  [endDate]: {

                  }
                  ,
                  ...datesPeriod
                }}
                markingType={"period"}
                pastScrollRange={1}
                futureScrollRange={3}
                showScrollIndicator={true}
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
