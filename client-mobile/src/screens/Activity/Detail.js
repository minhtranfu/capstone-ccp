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
import PropTypes from "prop-types";
import { Feather } from "@expo/vector-icons";
import { updateEquipmentStatus } from "../../redux/actions/equipment";
import { listTransactionByRequesterId } from "../../redux/actions/transaction";
import { cancelTransaction } from "../../redux/actions/transaction";

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
  PENDING: "Wait for supplier accept",
  ACCEPTED: "Supplier has been accepted",
  CANCEL: "Requester has been canceled",
  DELIVERING: "Equipment is on delivering",
  WAITING_FOR_RETURNING: "Return equipment to supplier",
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
      user: state.auth.data
    };
  },
  dispatch => ({
    fetchUpdateEquipmentStatus: (equipmentId, status) => {
      dispatch(updateEquipmentStatus(equipmentId, status));
    },
    fetchCancelRequest: transactionId => {
      dispatch(cancelTransaction(transactionId));
    },
    fetchRequesterTransaction: id => {
      dispatch(listTransactionByRequesterId(id));
    }
  })
)
class ActivityDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      calendarVisible: false,
      fromDate: "",
      toDate: ""
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
  _handleUpdateEquipmentStatus = (id, status) => {
    const { user } = this.props;
    this.props.fetchUpdateEquipmentStatus(id, { status: status });
    this.props.fetchRequesterTransaction(user.contractor.id);
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

  _renderCalendar = (minDate, maxDate) => (
    <Calendar
      animationType={"slide"}
      transparent={false}
      minDate={minDate}
      maxDate={maxDate}
      visible={this.state.calendarVisible}
      onLeftButtonPres={() => this._setCalendarVisible(false)}
      onSelectDate={this._handleSelectDate}
    />
  );

  _handleSelectDate = (fromDate, toDate, visible) => {
    const { id } = this.props.navigation.state.params;
    this.setState({ calendarVisible: visible });
    this.props.navigation.navigate("ConfirmAdjustDate", {
      fromDate,
      toDate,
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
      <View style={styles.columnWrapper}>
        <StepProgress
          options={STEP_PROGRESS_OPTIONS}
          status={status}
          equipmentStatus={EQUIPMENT_IN_PROGRESS[equipmentStatus]}
        />
      </View>
    );
  };

  _renderBottomButton = (equipmentId, status, equipmentStatus) => {
    switch (status) {
      case "PENDING":
        return (
          <View style={styles.columnWrapper}>
            <Button
              text={"Cancel"}
              onPress={this._handleCancelRequestTransaction}
            />
          </View>
        );
      case "PROCESSING":
        return equipmentStatus === "WAITING_FOR_RETURNING" ? null : (
          <View style={styles.columnWrapper}>
            {equipmentStatus === "RENTING" ? (
              <Button
                text={"Extend Time Range"}
                onPress={() => this._setCalendarVisible(true)}
              />
            ) : (
              <Button
                text={"Receive"}
                onPress={() =>
                  this._handleUpdateEquipmentStatus(equipmentId, "RENTING")
                }
              />
            )}
          </View>
        );
      default:
        return null;
    }

    return null;
  };

  _renderScrollViewItem = detail => {
    const totalDay = this._countTotalDay(detail.beginDate, detail.endDate);
    const totalPrice = totalDay * detail.dailyPrice;
    return (
      <View style={{ paddingHorizontal: 15 }}>
        <View style={styles.imageWrapper}>
          <Image
            source={{
              uri:
                "https://www.extremesandbox.com/wp-content/uploads/Extreme-Sandbox-Corportate-Events-Excavator-Lifting-Car.jpg"
            }}
            resizeMode={"cover"}
            style={styles.image}
          />
          <View style={{ flexDirection: "column", paddingLeft: 10 }}>
            <Text style={styles.title}>{detail.equipment.name}</Text>
          </View>
        </View>
        <View style={styles.columnWrapper}>
          <Text style={styles.title}>Available time ranges</Text>
          <Text style={styles.text}>
            From:{" "}
            <Text style={[styles.text, { paddingLeft: 10 }]}>
              {this._formatDate(detail.beginDate)}
            </Text>
          </Text>
          <Text style={styles.text}>
            To:{" "}
            <Text style={[styles.text, { paddingLeft: 10 }]}>
              {this._formatDate(detail.endDate)}
            </Text>
          </Text>
        </View>
        <View style={styles.columnWrapper}>
          <Text style={styles.title}>Price</Text>
          <View style={styles.priceItemWrapper}>
            <Text style={styles.text}>Price/day:</Text>
            <Text style={styles.text}>{detail.dailyPrice} K</Text>
          </View>
          <View style={styles.priceItemWrapper}>
            <Text style={styles.text}>Total price:</Text>
            <Text style={styles.text}>{totalPrice} K</Text>
          </View>
        </View>
        <View style={styles.columnWrapper}>
          <Text style={styles.title}>Contractor</Text>
          <View style={styles.rowWrapper}>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("ContractorProfile", {
                  id: detail.equipment.contractor.id
                })
              }
            >
              <ImageCache
                uri={
                  "https://cdn.iconscout.com/icon/free/png-256/avatar-369-456321.png"
                }
                style={styles.avatar}
                resizeMode={"cover"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flexDirection: "column", paddingLeft: 15 }}
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
            </TouchableOpacity>
          </View>
        </View>
        {this._renderCalendar(this._handleAddDay(detail.endDate, 1))}
        {this._renderStepProgress(detail.status, detail.equipment.status)}
        {this._renderBottomButton(
          detail.equipment.id,
          detail.status,
          detail.equipment.status
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
              <Feather name="x" size={26} />
            </TouchableOpacity>
          )}
        >
          <Text style={styles.header}>Request Transaction</Text>
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
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center"
  },
  columnWrapper: {
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
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
    width: 120,
    height: 80,
    borderRadius: 10
  },
  header: {
    fontSize: fontSize.h4,
    fontWeight: "500"
  },
  title: {
    fontSize: fontSize.h4,
    fontWeight: "500",
    paddingBottom: 10
  },
  text: {
    fontSize: fontSize.bodyText,
    fontWeight: "500",
    paddingBottom: 5
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25
  }
});

export default ActivityDetail;
