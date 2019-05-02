import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { Image as ImageCache } from "react-native-expo-image-cache";
import { connect } from "react-redux";
import { SafeAreaView } from "react-navigation";
import Feather from "@expo/vector-icons/Feather";
import { updateEquipmentStatus } from "../../redux/actions/equipment";
import { cancelTransaction } from "../../redux/actions/transaction";
import moment from "moment";

import ParallaxList from "../../components/ParallaxList";
import Title from "../../components/Title";
import Calendar from "../../components/Calendar";
import Header from "../../components/Header";
import Loading from "../../components/Loading";
import Button from "../../components/Button";
import StepProgress from "./components/StepProgress";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

const STEP_PROGRESS_OPTIONS = [
  {
    id: 1,
    name: "Pending",
    value: "PENDING"
  },
  {
    id: 2,
    name: "Accepted",
    value: "ACCEPTED"
  },
  {
    id: 3,
    name: "Processing",
    value: "PROCESSING"
  },
  {
    id: 4,
    name: "Finished",
    value: "FINISHED"
  }
];

const EQUIPMENT_IN_PROGRESS = {
  PENDING: "Waiting for supplier's acceptance",
  ACCEPTED: "Supplier has been accepted",
  CANCEL: "Requester has been canceled",
  DELIVERING: "Equipment is being delivered",
  WAITING_FOR_RETURNING: "Returning equipment to supplier",
  FINISHED: "Equipment has been returned"
};

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

@connect(
  (state, ownProps) => {
    const { id } = ownProps.navigation.state.params;
    return {
      detail: state.transaction.listRequesterTransaction.find(
        item => item.id === id
      ),
      feedbackLoading: state.transaction.feedbackLoading,
      user: state.auth.data
    };
  },
  dispatch => ({
    fetchUpdateEquipmentStatus: (transactionId, equipmentId, status) => {
      dispatch(updateEquipmentStatus(transactionId, equipmentId, status));
    },
    fetchCancelRequest: transactionId => {
      dispatch(cancelTransaction(transactionId));
    }
  })
)
class EquipmentDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      calendarVisible: false,
      beginDate: null,
      endDate: null,
      extendDate: null
    };
  }

  //Count total day from begin date to end date
  _countTotalDay = (fromDate, toDate) => {
    let firstDate = new Date(fromDate);
    let secondDate = new Date(toDate);
    let oneDay = 24 * 60 * 60 * 1000;
    totalDay = Math.round(
      Math.abs((secondDate.getTime() - firstDate.getTime()) / oneDay)
    );
    return totalDay > 1 ? totalDay : 1;
  };

  //Update equipment status to renting
  _handleUpdateEquipmentStatus = (transactionId, id, status) => {
    const { user } = this.props;
    console.log(transactionId, id);
    this.props.fetchUpdateEquipmentStatus(transactionId, id, {
      status: status
    });
    this.props.navigation.goBack();
  };

  //Cancel transaction request
  _handleCancelRequestTransaction = () => {
    const { id } = this.props.navigation.state.params;
    this.props.fetchCancelRequest(id);
    this.props.navigation.goBack();
  };

  _formatDate = date => {
    let newDate = new Date(date);
    let year = newDate.getFullYear();
    let month = newDate.getMonth() + 1;
    let day = newDate.getDate();
    let dayOfWeek = weekDays[newDate.getDay()];

    return dayOfWeek + ", " + day + "/" + month + "/" + year;
  };

  _setCalendarVisible = visible => {
    this.setState({ calendarVisible: visible });
  };

  _handleSelectDate = (date, visible) => {
    this.setState({
      extendDate: date,
      calendarVisible: visible
    });
  };

  _renderCalendar = dateRange => {
    const newBeginDate =
      new Date(dateRange.beginDate) < new Date(Date.now)
        ? Date.now()
        : dateRange.beginDate;
    if (new Date(dateRange.endDate) <= new Date(Date.now())) {
      console.log("ahihi");
    }
    return (
      <Calendar
        animationType={"slide"}
        transparent={false}
        minDate={moment(newBeginDate).format("YYYY-MM-DD")}
        maxDate={moment(dateRange.endDate).format("YYYY-MM-DD")}
        visible={this.state.calendarVisible}
        onLeftButtonPress={() => this._setCalendarVisible(false)}
        onSelectDate={this._handleSelectDate}
        single={true}
      />
    );
  };

  _handleSelectDate = (beginDate, endDate, visible) => {
    const { id } = this.props.navigation.state.params;
    this.setState({ calendarVisible: visible });
    const newEndDate = endDate ? endDate : moment(beginDate).add(30, "days");
    this.props.navigation.navigate("ConfirmAdjustDate", {
      beginDate,
      endDate: newEndDate,
      id
    });
  };

  _handleAddDay = (date, days) => {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    year = result.getFullYear();
    month = result.getMonth() + 1;
    dt = result.getDate();
    if (dt < 10) {
      dt = "0" + dt;
    }
    if (month < 10) {
      month = "0" + month;
    }
    return year + "-" + month + "-" + dt;
  };

  //If status is renting, return null
  _renderStepProgress = (status, equipmentStatus) => {
    return (
      <View style={[styles.columnWrapper, { marginBottom: 15 }]}>
        <StepProgress
          options={STEP_PROGRESS_OPTIONS}
          status={status}
          equipmentStatus={EQUIPMENT_IN_PROGRESS[equipmentStatus]}
        />
      </View>
    );
  };

  _renderBottomButton = (
    equipmentId,
    status,
    equipmentStatus,
    transactionId,
    hasFeedback
  ) => {
    switch (status) {
      case "FINISHED":
        return hasFeedback ? (
          <Text style={styles.text}>You've been feedbacked</Text>
        ) : (
          <Button
            text={"Feedback"}
            disabled={!!this.props.feedbackLoading}
            style={{ opacity: this.props.feedbackLoading ? 0.5 : 1 }}
            onPress={() =>
              this.props.navigation.navigate("Feedback", {
                transactionId: transactionId,
                type: "Equipment"
              })
            }
            wrapperStyle={{ marginTop: 15 }}
          />
        );
      case "PENDING":
        return (
          <View style={styles.columnWrapper}>
            <Button
              text={"Cancel"}
              onPress={this._handleCancelRequestTransaction}
              wrapperStyle={{ marginTop: 15, marginBottom: 15 }}
            />
          </View>
        );
      case "ACCEPTED":
        return (
          <View style={styles.columnWrapper}>
            <Button
              text={"Extend Time Range"}
              onPress={() => this._setCalendarVisible(true)}
              wrapperStyle={{ marginTop: 15, marginBottom: 15 }}
            />
          </View>
        );
      case "PROCESSING":
        return equipmentStatus === "WAITING_FOR_RETURNING" ? (
          <Button
            text={"Extend Time Range"}
            onPress={() => this._setCalendarVisible(true)}
            wrapperStyle={{ marginTop: 15, marginBottom: 15 }}
          />
        ) : (
          <View style={styles.columnWrapper}>
            {equipmentStatus === "RENTING" ? (
              <View>
                <Button
                  text={"Extend Time Range"}
                  onPress={() => this._setCalendarVisible(true)}
                  wrapperStyle={{ marginTop: 15 }}
                />
                <Button
                  text={"Early return"}
                  onPress={() =>
                    this._handleUpdateEquipmentStatus(
                      transactionId,
                      equipmentId,
                      "WAITING_FOR_RETURNING"
                    )
                  }
                  wrapperStyle={{ marginTop: 15, marginBottom: 15 }}
                />
              </View>
            ) : (
              <View>
                <Button
                  text={"Extend Time Range"}
                  onPress={() => this._setCalendarVisible(true)}
                  wrapperStyle={{ marginTop: 15 }}
                />
                <Button
                  text={"Receive"}
                  onPress={() =>
                    this._handleUpdateEquipmentStatus(
                      transactionId,
                      equipmentId,
                      "RENTING"
                    )
                  }
                  wrapperStyle={{ marginTop: 15, marginBottom: 15 }}
                />
              </View>
            )}
          </View>
        );
      default:
        return null;
    }

    return null;
  };

  _renderScrollViewItem = detail => {
    const end = moment(detail.endDate);
    const begin = moment(detail.beginDate);
    const duration = moment.duration(end.diff(begin));
    const days = duration.asDays() + 1;
    const totalPrice = days * detail.dailyPrice;
    const dateRange = {
      beginDate: detail.beginDate,
      endDate: detail.endDate
    };
    console.log(detail);
    return (
      <View style={{ paddingHorizontal: 15 }}>
        <ImageCache
          uri={
            "https://www.extremesandbox.com/wp-content/uploads/Extreme-Sandbox-Corportate-Events-Excavator-Lifting-Car.jpg"
          }
          resizeMode={"cover"}
          style={styles.image}
        />
        <Text style={styles.title}>{detail.equipment.name}</Text>
        <Text
          style={{ fontSize: fontSize.secondaryText, color: colors.text50 }}
        >
          {detail.equipmentAddress}
        </Text>
        <View>
          <Title title={"Hiring date"} />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={require("../../../assets/icons/icons8-calendar.png")}
              style={styles.calendarIcon}
              resizeMode={"contain"}
            />
            <Text style={styles.duration}>
              {`${days} ${days > 1 ? "days" : "day"}`}
            </Text>
          </View>
          <Text style={styles.startEndDate}>
            {begin.format("DD/MM/YY")} - {end.format("DD/MM/YY")}
          </Text>
        </View>
        <View style={{ marginTop: 5 }}>
          <View style={styles.priceItemWrapper}>
            <Text style={styles.text}>Price per day:</Text>
            <Text style={styles.price}>{detail.dailyPrice} K</Text>
          </View>
          <View style={styles.priceItemWrapper}>
            <Text style={styles.text}>Total price:</Text>
            <Text style={styles.price}>{totalPrice} K</Text>
          </View>
        </View>
        <View>
          <Title title={"Contractor"} />
          <TouchableOpacity
            style={styles.rowWrapper}
            onPress={() =>
              this.props.navigation.navigate("ContractorProfile", {
                id: detail.equipment.contractor.id
              })
            }
          >
            <View>
              <ImageCache
                uri={
                  "https://cdn.iconscout.com/icon/free/png-256/avatar-369-456321.png"
                }
                style={styles.avatar}
                resizeMode={"cover"}
              />
            </View>
            <View
              style={{
                flexDirection: "column",
                paddingLeft: 15
              }}
            >
              <Text style={styles.text}>
                Name: {detail.equipment.contractor.name}
              </Text>
              <Text style={styles.text}>
                Phone: {detail.equipment.contractor.phoneNumber}
              </Text>
              <Text style={styles.text}>
                Email: {detail.equipment.contractor.email}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        {this._renderCalendar(dateRange)}
        {this._renderStepProgress(detail.status, detail.equipment.status)}
        {this._renderBottomButton(
          detail.equipment.id,
          detail.status,
          detail.equipment.status,
          detail.id,
          detail.feedbacked
        )}
      </View>
    );
  };

  render() {
    const { detail } = this.props;
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "never", top: "always" }}
      >
        <Header
          renderLeftButton={() => (
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.goBack();
              }}
            >
              <Feather name="chevron-left" size={24} />
            </TouchableOpacity>
          )}
        >
          <Text style={styles.header}>Equipment request</Text>
        </Header>
        {detail ? (
          <ScrollView>{this._renderScrollViewItem(detail)}</ScrollView>
        ) : (
          <Loading />
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  imageWrapper: {
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  columnWrapper: {
    flexDirection: "column",
    justifyContent: "center"
  },
  rowWrapper: {
    flexDirection: "row",
    alignItems: "center"
  },
  priceItemWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  image: {
    height: 200,
    borderRadius: 10,
    marginBottom: 15
  },
  header: {
    fontSize: fontSize.bodyText,
    fontWeight: "500"
  },
  title: {
    fontSize: fontSize.bodyText,
    fontWeight: "500",
    marginBottom: 5
  },
  text: {
    fontSize: fontSize.secondaryText,
    fontWeight: "500",
    marginBottom: 5
  },
  price: {
    color: colors.secondaryColor,
    fontSize: fontSize.bodyText,
    fontWeight: "500"
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25
  },
  calendarIcon: {
    width: 15,
    aspectRatio: 1,
    tintColor: colors.text50,
    marginRight: 3
  },
  startEndDate: {
    fontSize: fontSize.caption,
    color: colors.text,
    fontWeight: "600",
    marginLeft: 15 + 3,
    marginTop: 3
  }
});

export default EquipmentDetail;
