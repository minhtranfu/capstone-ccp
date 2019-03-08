import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Switch,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert
} from "react-native";
import { Image as ImageCache } from "react-native-expo-image-cache";
import { SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Feather } from "@expo/vector-icons";
import { ImagePicker, Permissions } from "expo";
import {
  getTransactionDetail,
  requestTransaction,
  cancelTransaction,
  getAdjustTransaction,
  requestAdjustTransaction
} from "../../redux/actions/transaction";

import Item from "./components/Item";
import InputField from "../../components/InputField";
import Dropdown from "../../components/Dropdown";
import Header from "../../components/Header";
import Button from "../../components/Button";
import Loading from "../../components/Loading";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const DROPDOWN_GENERAL_TYPES_OPTIONS = [
  {
    id: 0,
    name: "Select general equipment types",
    value: "all"
  }
];

const DROPDOWN_TYPES_OPTIONS = [
  {
    id: 0,
    name: "Select equipment types",
    value: "all"
  }
];

const COLORS = {
  ACCEPTED: "#4DB781", //green
  DENIED: "#FF5C5C", //red
  PENDING: "#FFDF49", //yellow
  PROCESSING: "#7199FE", //blue
  default: "red"
};

@connect(
  (state, ownProps) => {
    const { id } = ownProps.navigation.state.params;
    return {
      transactionDetail: state.transaction.listSupplierTransaction.find(
        item => item.id === id
      ),
      loading: state.transaction.adjustLoading,
      adjustTransactionList: state.transaction.adjustTransaction
    };
  },
  dispatch => ({
    fetchRequestTransaction: (id, transactionStatus) => {
      dispatch(requestTransaction(id, transactionStatus));
    },
    fetchCancelTransaction: id => {
      dispatch(cancelTransaction(id));
    },
    fetchGetAdjustTransaction: id => {
      dispatch(getAdjustTransaction(id));
    },
    fetchRequestTransaction: (id, status) => {
      dispatch(requestAdjustTransaction(id, status));
    }
  })
)
class MyTransactionDetail extends Component {
  componentDidMount() {
    const { id } = this.props.navigation.state.params;
    this.props.fetchGetAdjustTransaction(id);
  }

  _handleRequestButton = (id, status) => {
    this.props.fetchRequestTransaction(id, { status: status });
    this.props.navigation.goBack();
  };

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

  _formatDate = date => {
    let newDate = new Date(date);
    let year = newDate.getFullYear();
    let month = newDate.getMonth() + 1;
    let day = newDate.getDate();
    let dayOfWeek = weekDays[newDate.getDay()];

    return dayOfWeek + ", " + day + "/" + month + "/" + year;
  };

  _showAlert = msg => {
    Alert.alert("Error", msg, [{ text: "OK" }], {
      cancelable: true
    });
  };

  _handleRequestTransaction = (
    transactionId,
    transactionStatus,
    transactionTitle
  ) => {
    Alert.alert(transactionTitle, undefined, [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel"
      },
      {
        text: "OK",
        onPress: () =>
          this._handleRequestButton(transactionId, transactionStatus)
      }
    ]);
  };

  _renderAcceptedBottom = id => (
    <View style={styles.bottomWrapper}>
      <Button
        text={"Delivery"}
        onPress={() => {
          this._handleRequestTransaction(
            id,
            "PROCESSING",
            "Are you sure you want delivery now?"
          );
        }}
      />
      <Button
        text={"Cancel"}
        onPress={() => {
          this.props.fetchCancelTransaction(id);
          this.props.navigation.goBack();
        }}
      />
    </View>
  );

  _renderPendingBottom = id => {
    return (
      <View style={styles.bottomWrapper}>
        <Button
          text={"Accept"}
          onPress={() => {
            this._handleRequestTransaction(
              id,
              "ACCEPTED",
              "Are you sure to accept?"
            );
          }}
        />
        <Button
          text={"Deny"}
          onPress={() => {
            this._handleRequestTransaction(
              id,
              "DENIED",
              "Are you sure to deny transaction?"
            );
          }}
        />
      </View>
    );
  };

  _handleRequestAdjustTransaction = (transactionId, status) => {
    this.props.requestAdjustTransaction(transactionId, { status: status });
  };

  _renderAdjustDateTransaction = (id, equipmentStatus) => {
    const { adjustTransactionList } = this.props;
    console.log(adjustTransactionList);
    if (equipmentStatus === "RENTING" && adjustTransactionList.length > 0) {
      return (
        <View>
          <Text>New Adjust Transaction Request</Text>
          <Text>{adjustTransactionList.requestedBeginDate}</Text>
          <Text>{adjustTransactionList.requestedEndDate}</Text>
          <Text>Status: {adjustTransactionList.status}</Text>
          {adjustTransactionList.status === "PENDING" ? (
            <View>
              <TouchableOpacity
                onPress={() =>
                  this._handleRequestAdjustTransaction(id, "ACCEPTED")
                }
              >
                <Text>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  this._handleRequestAdjustTransaction(id, "DENIED")
                }
              >
                <Text>Deny</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      );
    }
    return null;
  };

  _renderProcessingBottom = (id, equipmentStatus) => {
    console.log(equipmentStatus);
    return (
      <View style={styles.bottomWrapper}>
        {equipmentStatus !== "AVAILABLE" ? (
          <Button
            text={"FINISH"}
            onPress={() => {
              this._handleRequestButton(id, "FINISHED");
            }}
          />
        ) : null}
      </View>
    );
  };

  _renderBottomButton = (status, id, equipmentStatus) => {
    switch (status) {
      case "ACCEPTED":
        return this._renderAcceptedBottom(id);
      case "PENDING":
        return this._renderPendingBottom(id);
      case "PROCESSING":
        return this._renderProcessingBottom(id, equipmentStatus);
      default:
        return null;
    }
  };

  _renderContractor = detail => (
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
        <TouchableOpacity style={{ flexDirection: "column", paddingLeft: 15 }}>
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
  );

  _renderTransactionOnProcess = (status, equipment) => {
    if (status === "ACCEPTED" && equipment.processingHiringTransaction) {
      return (
        <View style={styles.columnWrapper}>
          <Text style={styles.title}>Transaction on processing</Text>
          <Item
            imageURL={
              "https://www.extremesandbox.com/wp-content/uploads/Extreme-Sandbox-Corportate-Events-Excavator-Lifting-Car.jpg"
            }
            name={equipment.name}
            beginDate={equipment.processingHiringTransaction.beginDate}
            endDate={equipment.processingHiringTransaction.endDate}
            status={equipment.processingHiringTransaction.status}
            onPress={() =>
              this.props.navigation.navigate("MyTransactionDetail", {
                id: equipment.processingHiringTransaction.id
              })
            }
          />
        </View>
      );
    }
    return null;
  };

  _renderScrollViewItem = detail => {
    console.log(detail);
    const totalDay = this._countTotalDay(detail.beginDate, detail.endDate);
    const totalPrice = totalDay * detail.dailyPrice;
    const { id } = this.props.navigation.state.params;
    return (
      <View style={{ paddingHorizontal: 15 }}>
        <View style={styles.imageWrapper}>
          <ImageCache
            uri={
              "https://www.extremesandbox.com/wp-content/uploads/Extreme-Sandbox-Corportate-Events-Excavator-Lifting-Car.jpg"
            }
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
        {this._renderContractor(detail)}
        {this._renderTransactionOnProcess(detail.status, detail.equipment)}
        {this._renderAdjustDateTransaction(id, detail.equipment.status)}
        {this._renderBottomButton(detail.status, id, detail.equipment.status)}
      </View>
    );
  };

  render() {
    const { transactionDetail, loading } = this.props;
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
          <Text style={styles.header}>My Transaction Detail</Text>
        </Header>
        {Object.keys(transactionDetail).length > 0 && !loading ? (
          <ScrollView>
            {this._renderScrollViewItem(transactionDetail)}
          </ScrollView>
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
  bottomWrapper: {
    marginBottom: 10
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
    fontWeight: "400",
    color: colors.text,
    marginBottom: 10
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

export default MyTransactionDetail;
