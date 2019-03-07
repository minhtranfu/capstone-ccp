import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import { adjustDateTransaction } from "../../redux/actions/transaction";

@connect(
  state => ({}),
  dispatch => ({
    fetchAdjustDate: (id, date) => {
      dispatch(adjustDateTransaction(id, date));
    }
  })
)
class ConfirmAdjustDate extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  _handleConfirmAdjustDate = async (fromDate, toDate, transactionId) => {
    const date = {
      requestedBeginDate: fromDate,
      requestedEndDate: toDate
    };
    this.props.fetchAdjustDate(transactionId, date);
    this.props.navigation.goBack();
  };

  render() {
    const { fromDate, toDate, id } = this.props.navigation.state.params;
    console.log(fromDate);
    return (
      <SafeAreaView forceInset={{ top: "always", bottom: "always" }}>
        <Text>Adjust Transaction Date</Text>
        <Text />
        <Text />
        <TouchableOpacity
          onPress={() => this._handleConfirmAdjustDate(fromDate, toDate, id)}
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
