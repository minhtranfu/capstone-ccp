import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Modal from 'react-native-modal';
import { SafeAreaView } from "react-navigation";
import { CalendarList as CalendarPeriod } from "react-native-calendars";
import dateFnsFormat from "date-fns/format";
import compareAsc from "date-fns/compare_asc";
import Feather from "@expo/vector-icons/Feather";

import Header from "../components/Header";
import Button from "../components/Button";
import fontSize from "../config/fontSize";
import colors from "../config/colors";
import moment from 'moment';

const getDaysArray = (start, end) => {
  for (var arr = [], dt = start; dt <= end; dt.setDate(dt.getDate() + 1)) {
    arr.push(new Date(dt));
  }
  return arr.map(v => v.toISOString().slice(0, 10));
};

class Calendar extends PureComponent {
  static propTypes = {
    minDate: PropTypes.string,
    maxDate: PropTypes.string,
    animationType: PropTypes.string,
    visible: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {
      isFromDatePicked: false,
      isToDatePicked: false,
      markedDates: {},
      //Add from date range to make user only click from date to date
      fromDate: this._handleDateFormat(props.fromDate) || "",
      endDate: this._handleDateFormat(props.endDate) || ""
    };
  }

  componentWillUnmount() {
    this._handleClearDate();
  }

  _handleNotAvailableDay = () => {
    const { availableDateRange } = this.props;
    if (availableDateRange) {
      const availableDate = availableDateRange.reduce((acc, cur) => {
        const dateList = getDaysArray(
          new Date(cur.startDate),
          new Date(cur.endDate)
        );
        console.log(dateList);
        return acc.concat(dateList);
      }, []);
      availableDate.sort((a, b) => compareAsc(new Date(a), new Date(b)));
      //remove duplicate date if has
      const uniqueAvailableDate = [...new Set(availableDate)];
      const firstAvailableDate = uniqueAvailableDate[0];
      const lastAvailableDate =
        uniqueAvailableDate[uniqueAvailableDate.length - 1];
      const allDateList = getDaysArray(
        new Date(firstAvailableDate),
        new Date(lastAvailableDate)
      );
      const notAvailableDate = allDateList.filter(
        date => !uniqueAvailableDate.includes(date)
      );
      return notAvailableDate.reduce(
        (acc, cur) => ({
          ...acc,
          [cur]: {
            selected: false,
            disabled: true,
            disableTouchEvent: true
          }
        }),
        {}
      );
    }
    return {};
  };

  //Find date between from date and to date
  _findDiffDay = (fromDate, toDate) => {
    let firstDate = new Date(fromDate);
    let secondDate = new Date(toDate);
    let oneDay = 24 * 60 * 60 * 1000;
    return Math.round((secondDate.getTime() - firstDate.getTime()) / oneDay);
  };

  //Format date to yyyy-mm-dd
  _handleDateFormat = date => {
    return moment(date).format('YYYY-MM-DD')
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
        color: colors.secondaryColor,
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
            color: colors.secondaryColor,
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
              color: colors.secondaryColor,
              textColor: "white"
            };
          }
          if (i < range) {
            markedDates[tempDate] = {
              color: colors.secondaryColor,
              textColor: "white"
            };
          } else {
            markedDates[tempDate] = {
              endingDay: true,
              color: colors.secondaryColor,
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
    const {
      minDate,
      maxDate,
      onSelectDate,
      animationType,
      transparent,
      visible,
      onLeftButtonPress,
      timeRange
    } = this.props;
    const { fromDate, endDate } = this.state;

    return (
      <Modal
        style={{margin: 0, padding: 0, flex: 1}}
        isVisible={visible}
        hasBackdrop={false}
      >
        <SafeAreaView
          forceInset={{ bottom: "none", top: "always" }}
          style={styles.container}
        >
          <Header
            renderLeftButton={() => (
              <TouchableOpacity>
                <Feather name={"x"} size={22} onPress={onLeftButtonPress} />
              </TouchableOpacity>
            )}
            renderRightButton={() => (
              <TouchableOpacity onPress={this._handleClearDate}>
                <Text>Clear</Text>
              </TouchableOpacity>
            )}
          />

          <CalendarPeriod
            // disabledByDefault={true}
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
              textSectionTitleColor: "#0D2421",
              todayTextColor: colors.secondaryColor,
              dayTextColor: '#2d4150',
              arrowColor: "#065747",
              monthTextColor: colors.text,
              textMonthFontSize: fontSize.h2,
              textMonthFontWeight: '700',
              textDayFontSize: fontSize.secondaryText,
              textDayFontWeight: '600',
              textDayHeaderFontSize: fontSize.secondaryText,
              textDayHeaderFontWeight: '600',
            }}
            markedDates={{
              ...this.state.markedDates,
              ...this._handleNotAvailableDay()
            }}
            {...this.props}
          />
          <SafeAreaView forceInset={{bottom: 'always'}} style={{backgroundColor: colors.primaryColor}}>
            <Button
              text={"Confirm"}
              bordered={false}
              wrapperStyle={{
                backgroundColor: "transparent",
                paddingVertical: 15,
                paddingHorizontal: -15,
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0
              }}
              onPress={() => {
                onSelectDate(fromDate, endDate, false);
                this.setState({ markedDates: {} });
              }}
            />
          </SafeAreaView>
        </SafeAreaView>
      </Modal>
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
    flex: 1,
    justifyContent: "center",
    flexDirection: "column",
    backgroundColor: 'white',
  }
});

export default Calendar;
