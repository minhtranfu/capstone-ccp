import React, { PureComponent } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Calendar } from "react-native-calendars";
import dateFnsFormat from "date-fns/format";
import compareAsc from "date-fns/compare_asc";
import { addYears } from "date-fns";

const theme = {
  textSectionTitleColor: "#0D2421",
  dayTextColor: "#0D2421",
  arrowColor: "#065747",
  monthTextColor: "#065747",
  textMonthFontSize: 16,
  textDayFontSize: 15,
  textDayHeaderFontSize: 15
};

class WithRangeCalendar extends PureComponent {
  constructor(props) {
    super(props);
    const availableDateRange = this.props.availableDateRange;
    console.log(availableDateRange);

    this.state = {
      selectedDate: [],
      clickedTime: 0
    };

    this.clickedDate = "";
    if (availableDateRange) {
      const availableDate = availableDateRange.reduce((acc, cur) => {
        const dateList = this.getDaysArray(
          new Date(cur.beginDate),
          new Date(cur.endDate)
        );
        return acc.concat(dateList);
      }, []);

      availableDate.sort((a, b) => compareAsc(new Date(a), new Date(b)));
      //remove duplicate date if has
      this.uniqueAvailableDate = [...new Set(availableDate)];
      const firstAvailableDate = this.uniqueAvailableDate[0];
      const lastAvailableDate = this.uniqueAvailableDate[
        this.uniqueAvailableDate.length - 1
      ];
      const allDateList = this.getDaysArray(
        new Date(firstAvailableDate),
        new Date(lastAvailableDate)
      );

      this.notAvailableDate = allDateList.filter(
        date => !this.uniqueAvailableDate.includes(date)
      );

      this.notAvailableDateStyle = this.notAvailableDate.reduce(
        (acc, cur) => ({
          ...acc,
          [cur]: {
            selected: false,
            selectedColor: "#9b9b9b",
            disabled: true,
            disableTouchEvent: true
          }
        }),
        {}
      );
    }
  }

  getDaysArray = (start, end) => {
    for (var arr = [], dt = start; dt <= end; dt.setDate(dt.getDate() + 1)) {
      arr.push(new Date(dt));
    }
    return arr.map(v => v.toISOString().slice(0, 10));
  };

  handleSelectDate = date => {
    const { dateString } = date;
    const { single } = this.props;
    if (this.notAvailableDate && this.notAvailableDate.includes(dateString))
      return;

    const { clickedTime, selectedDate } = this.state;
    const selectedDateFiltered = single
      ? selectedDate.filter(date =>
          [dateString, this.clickedDate].includes(date)
        )
      : selectedDate.filter(dateRange => {
          const existedDate = dateRange.find(dateInRange =>
            [dateString, this.clickedDate].includes(dateInRange)
          );
          return existedDate ? false : true;
        });

    if (clickedTime === 0) {
      this.clickedDate = dateString;
      return this.setState(() => ({
        clickedTime: 1,
        selectedDate: single ? [] : selectedDate
      }));
    }
    if (clickedTime === 1) {
      let startDate, endDate;
      if (compareAsc(new Date(this.clickedDate), new Date(dateString)) <= 0) {
        startDate = this.clickedDate;
        endDate = dateString;
      } else {
        startDate = dateString;
        endDate = this.clickedDate;
      }

      const dateList = this.getDaysArray(
        new Date(startDate),
        new Date(endDate)
      );
      this.clickedDate = "";
      return this.setState(() => {
        //if [2019-03-14,2019-03-15, 2019-03-16] is on selectedDate
        //and dateList is [2019-03-14, 2019-03-15, 2019-03-16, 2019-03-17]
        //then [2019-03-14,2019-03-15, 2019-03-16] is filtered out
        const selectedDateFilteredDateInCommon = single
          ? []
          : selectedDateFiltered.filter(dateRange => {
              const shouldNotInclude = dateRange.every(dateInRange =>
                dateList.includes(dateInRange)
              );
              return !shouldNotInclude;
            });

        return {
          clickedTime: 0,
          selectedDate: single
            ? [...dateList]
            : [...selectedDateFilteredDateInCommon, [...dateList]]
        };
      });
    }
  };

  reduceArrayStyle = array => {
    return array.reduce((acc, cur, curIndex) => {
      return {
        ...acc,
        [cur]: {
          selected: true,
          startingDay: curIndex === 0 ? true : false,
          endingDay: curIndex === array.length - 1 ? true : false,
          color: "green"
        }
      };
    }, {});
  };

  render() {
    const { selectedDate } = this.state;
    const { onConfirm, single, onClose } = this.props;

    const selectedDateStyleArray = single
      ? this.reduceArrayStyle(selectedDate)
      : selectedDate.map(dayList => {
          return this.reduceArrayStyle(dayList);
        });

    const selectedDateStyle = single
      ? selectedDateStyleArray
      : selectedDateStyleArray.reduce(
          (acc, cur) => ({
            ...acc,
            ...cur
          }),
          {}
        );

    let minDate = new Date();
    let maxDate = addYears(minDate, 1);

    if (this.uniqueAvailableDate) {
      minDate = new Date(this.uniqueAvailableDate[0]);
      maxDate = new Date(
        this.uniqueAvailableDate[this.uniqueAvailableDate.length - 1]
      );
    }

    return (
      <View style={styles.container}>
        <Calendar
          style={styles.calendarWrapper}
          theme={theme}
          onDayPress={this.handleSelectDate}
          onDayLongPress={this.handleSelectDate}
          minDate={dateFnsFormat(minDate, "YYYY-MM-DD")}
          maxDate={dateFnsFormat(maxDate, "YYYY-MM-DD")}
          firstDay={1}
          horizontal={true}
          pagingEnabled={true}
          onPressArrowLeft={substractMonth => substractMonth()}
          onPressArrowRight={addMonth => addMonth()}
          markedDates={{
            [this.clickedDate]: {
              selected: true,
              startingDay: true,
              endingDay: true,
              color: "green"
            },
            ...selectedDateStyle,
            ...this.notAvailableDateStyle
          }}
          markingType={"period"}
        />
        <View
          style={{
            flexDirection: "row"
          }}
        >
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              this.setState(() => ({
                selectedDate: [],
                clickedTime: 0
              }))
            }
          >
            <Text>Clear</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            disabled={selectedDate.length === 0}
            onPress={() => {
              const date = {
                beginDate: selectedDate[0],
                endDate: selectedDate[selectedDate.length - 1]
              };
              onConfirm && onConfirm(date);
            }}
          >
            <Text>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => onClose && onClose()}
          >
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 400,
    width: "95%"
  },
  calendarWrapper: {
    paddingVertical: 5
  },
  button: {
    backgroundColor: "#DDDDDD",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10
  }
});

export default WithRangeCalendar;
