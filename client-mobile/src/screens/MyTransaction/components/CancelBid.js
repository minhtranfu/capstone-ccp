import React, { Component } from "react";
import { SafeAreaView } from "react-navigation";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { connect } from "react-redux";
import { updateDebrisTransactionStatus } from "../../../redux/actions/transaction";

import Button from "../../../components/Button";
import TextArea from "../../../components/TextArea";

import fontSize from "../../../config/fontSize";
import colors from "../../../config/colors";

@connect(
  state => ({}),
  dispatch => ({
    fetchUpdateStatus: (transactionId, status) => {
      dispatch(updateDebrisTransactionStatus(transactionId, status));
    }
  })
)
class CancelBid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: ""
    };
  }

  _handleSubmit = () => {
    this.props.fetchUpdateStatus(transactionId, {
      status: "CANCELED",
      cancelReason: input
    });
    this.props.navigation.goBack();
  };

  render() {
    const { input } = this.state;
    const { transactionId } = this.props.navigation.state.params;
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "always", top: "always" }}
      >
        <ScrollView contentContainerStyle={{ paddingHorizontal: 15 }}>
          <TextArea
            maxLength={200}
            value={description}
            onChangeText={value => this.setState({ input: value })}
          />
          <Button text={"Submit"} onPress={this._handleSubmit} />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default CancelBid;
