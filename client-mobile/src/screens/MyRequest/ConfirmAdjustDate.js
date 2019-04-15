import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { requestAdjustTransaction } from "../../redux/actions/transaction";

@connect(
  state => ({}),
  dispatch =>
    bindActionCreators({ fetchAdjustDate: requestAdjustTransaction }, dispatch)
)
class ConfirmAdjustDate extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  _handleConfirmAdjustDate = async (beginDate, endDate, transactionId) => {
    const date = {
      hiringTransactionEntity: {
        id: transactionId
      },
      requestedEndDate: endDate
    };
    this.props.fetchAdjustDate(date);
    this.props.navigation.goBack();
  };

  render() {
    const { beginDate, endDate, id } = this.props.navigation.state.params;
    console.log(beginDate);
    return (
      <SafeAreaView forceInset={{ top: "always", bottom: "always" }}>
        <Text>Adjust Transaction Date</Text>
        <Text>From: {beginDate}</Text>
        <Text>To: {endDate}</Text>
        <TouchableOpacity
          onPress={() => this._handleConfirmAdjustDate(beginDate, endDate, id)}
        >
          <Text> Confirm </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default ConfirmAdjustDate;
