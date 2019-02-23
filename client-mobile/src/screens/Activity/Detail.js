import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { connect } from "react-redux";
import { SafeAreaView } from "react-navigation";
import PropTypes from "prop-types";
import { Feather } from "@expo/vector-icons";
import {
  getTransactionDetail,
  clearTransactionDetail
} from "../../redux/actions/transaction";

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
    name: "Delivery",
    value: "DELIVERY"
  },
  {
    id: 4,
    name: "Returning",
    value: "RETURNING"
  }
];

@connect(
  state => {
    return {
      detail: state.transaction.transactionDetail
    };
  },
  dispatch => ({
    fetchTransactionDetail: id => {
      dispatch(getTransactionDetail(id));
    },
    fetchClearDetail: () => {
      dispatch(clearTransactionDetail());
    }
  })
)
class ActivityDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { id } = this.props.navigation.state.params;
    console.log(id);
    this.props.fetchTransactionDetail(id);
  }

  //Replace Splash -> ','  from date
  _replaceSplash = date => {
    let regex = /-/g;
    return date.replace(regex, ",");
  };

  //Count total day from begin date to end date
  _countTotalDay = (firstDate, secondDate) => {
    let oneDay = 24 * 60 * 60 * 1000; //hours,mintues,sec, milisec
    let startDate = new Date(this._replaceSplash(firstDate));
    let endDate = new Date(this._replaceSplash(secondDate));
    let totalDay = Math.round(
      Math.abs((startDate.getTime() - endDate.getTime()) / oneDay)
    );
    return totalDay > 1 ? totalDay : 1;
  };

  //If status is renting, return null
  _renderStepProgress = status => {
    if (status !== "RENTING")
      return (
        <View style={styles.columnWrapper}>
          <StepProgress options={STEP_PROGRESS_OPTIONS} status={status} />
        </View>
      );
    return null;
  };

  _renderBottomButton = status => {
    if (status === "RENTING") {
      return (
        <View style={styles.columnWrapper}>
          <Button text={"Extend Duration"} />
        </View>
      );
    } else if (status === "PENDING") {
      return (
        <View style={styles.columnWrapper}>
          <Button text={"Cancel"} />
        </View>
      );
    }
    return null;
  };

  _renderScrollViewItem = () => {
    const { detail } = this.props;
    console.log("show detail", detail);
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
            <Text style={styles.text}>
              Contractor: {detail.equipment.contractor.name}
            </Text>
            <Text style={styles.text}>
              Phone: {detail.equipment.contractor.phoneNumber}
            </Text>
          </View>
        </View>
        <View style={styles.columnWrapper}>
          <Text style={styles.title}>Duration</Text>
          <Text style={styles.text}>
            From:{" "}
            <Text style={[styles.text, { paddingLeft: 10 }]}>
              {detail.beginDate}
            </Text>
          </Text>
          <Text style={styles.text}>
            To:{" "}
            <Text style={[styles.text, { paddingLeft: 10 }]}>
              {detail.endDate}
            </Text>
          </Text>
        </View>
        <View style={styles.columnWrapper}>
          <Text style={styles.title}>Price</Text>
          <View style={styles.priceItemWrapper}>
            <Text style={styles.text}>Price/day:</Text>
            <Text style={styles.text}>{detail.dailyPrice} $</Text>
          </View>
          <View style={styles.priceItemWrapper}>
            <Text style={styles.text}>Total price:</Text>
            <Text style={styles.text}>{totalPrice} $</Text>
          </View>
        </View>
        {this._renderStepProgress(detail.status)}
        {this._renderBottomButton(detail.status)}
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
                this.props.fetchClearDetail();
                this.props.navigation.goBack();
              }}
            >
              <Feather name="x" size={24} />
            </TouchableOpacity>
          )}
        >
          <Text style={styles.header}>Detail Transaction</Text>
        </Header>
        {Object.keys(detail).length > 0 ? (
          <ScrollView>{this._renderScrollViewItem()}</ScrollView>
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
    fontSize: fontSize.h3,
    fontWeight: "600"
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
  }
});

export default ActivityDetail;
