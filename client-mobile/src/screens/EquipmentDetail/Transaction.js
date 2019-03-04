import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert
} from "react-native";
import { SafeAreaView, NavigationActions } from "react-navigation";
import { connect } from "react-redux";
import { Feather } from "@expo/vector-icons";
import { sendTransactionRequest } from "../../redux/actions/transaction";

import Header from "../../components/Header";
import Button from "../../components/Button";
import Loading from "../../components/Loading";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

@connect(
  state => ({
    status: state.status
  }),
  dispatch => ({
    fetchSendRequest: transactionDetail => {
      dispatch(sendTransactionRequest(transactionDetail));
    }
  })
)
class ConfirmTransaction extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  _handleConfirmBooking = async transactionDetail => {
    await this.props.fetchSendRequest(transactionDetail);
  };

  render() {
    const { equipment, name } = this.props.navigation.state.params;
    const { query } = this.props.navigation.state.params;
    const backAction = NavigationActions.back({
      key: "Result"
    });
    console.log(query);
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "always", top: "always" }}
      >
        <Header
          renderLeftButton={() => (
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Feather name="arrow-left" size={24} />
            </TouchableOpacity>
          )}
        >
          <Text style={styles.header}>Review booking</Text>
        </Header>
        {equipment ? (
          <ScrollView style={{ paddingHorizontal: 15 }}>
            <Text style={styles.text}>Name: {name}</Text>
            <Text style={styles.text}>Begin date: {equipment.beginDate}</Text>
            <Text style={styles.text}>End date:{equipment.endDate}</Text>
            <Button
              text={"Confirm Booking"}
              onPress={() => {
                this._handleConfirmBooking(equipment);
                this.props.navigation.goBack();
              }}
            />
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
  header: {
    fontSize: fontSize.h4,
    fontWeight: "600"
  },
  text: {
    fontSize: fontSize.bodyText,
    fontWeight: "500"
  },
  buttonWrapper: {}
});

export default ConfirmTransaction;
