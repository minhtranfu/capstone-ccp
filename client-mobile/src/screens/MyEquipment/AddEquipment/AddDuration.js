import React, { Component } from "react";
import {
  View,
  Text,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  Image
} from "react-native";
import { SafeAreaView } from "react-navigation";
import Calendar from "react-native-calendar-select";

import Header from "../../../components/Header";
import colors from "../../../config/colors";
import fontSize from "../../../config/fontSize";

class AddDuration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: "",
      endDate: "",
      duration: [],
      valueArray: [],
      disabled: false
    };
    this.index = 0;

    this.animatedValue = new Animated.Value(0);
  }

  confirmDate = ({ startDate, endDate, startMoment, endMoment }) => {
    const newDate = {
      startDate: this.handleFormatDate(new Date(startDate)),
      endDate: this.handleFormatDate(new Date(endDate))
    };
    this.setState({
      duration: [...this.state.duration, newDate],
      startDate: this.handleFormatDate(new Date(startDate)),
      endDate: this.handleFormatDate(new Date(endDate))
    });
  };
  openCalendar = () => {
    this.calendar && this.calendar.open();
  };

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

  render() {
    const animationValue = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [-59, 0]
    });
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
        save: "Save",
        clear: "Reset"
      },
      date: "DD / MM" // date format
    };
    // optional property, too.
    let color = {
      subColor: "#f0f0f0"
    };

    let newArray = this.state.valueArray.map((item, key) => {
      if (key == this.index) {
        return (
          <Animated.View
            key={key}
            style={[
              styles.viewHolder,
              {
                opacity: this.animatedValue,
                transform: [{ translateY: animationValue }]
              }
            ]}
          >
            <Text>New time range</Text>
          </Animated.View>
        );
      } else {
        return (
          <View key={key} style={styles.viewHolder}>
            <TouchableOpacity onPress={this.openCalendar}>
              <Text style={styles.text}>Your available time range</Text>
            </TouchableOpacity>
            <Calendar
              i18n="en"
              ref={calendar => {
                this.calendar = calendar;
              }}
              customI18n={customI18n}
              color={color}
              format="YYYY-MM-DD"
              minDate={this.handleFormatDate(new Date())}
              maxDate="2019-03-12"
              startDate={this.state.startDate}
              endDate={this.state.endDate}
              onConfirm={this.confirmDate}
            />
            {this.state.duration.length > key ? (
              <View>
                <Text>From: {this.state.duration[key].startDate}</Text>
                <Text>To: {this.state.duration[key].endDate}</Text>
              </View>
            ) : (
              <View>
                <Text>From: N/A</Text>
                <Text>To: N/A</Text>
              </View>
            )}
          </View>
        );
      }
    });

    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "never", top: "aways" }}
      >
        <Header>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Text>Go Back</Text>
          </TouchableOpacity>
        </Header>
        <Text
          style={{
            fontSize: fontSize.h4,
            fontWeight: "500",
            color: colors.text
          }}
        >
          Time range
        </Text>
        <ScrollView>
          <View style={{ flex: 1, padding: 4 }}>{newArray}</View>
        </ScrollView>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.btn}
          disabled={this.state.disabled}
          onPress={this.handleAddMore}
        >
          <Text>Icon</Text>
        </TouchableOpacity>
        <View style={styles.bottomWrapper}>
          <TouchableOpacity
            style={[styles.buttonWrapper, styles.buttonEnable]}
            onPress={() => this.props.navigation.navigate("AddImage")}
          >
            <Text style={styles.text}>Next</Text>
            <Text>></Text>
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
    paddingBottom: 20,
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
  },
  text: {
    fontSize: fontSize.bodyText,
    fontWeight: "bold",
    color: colors.secondaryColor
  }
});

export default AddDuration;
