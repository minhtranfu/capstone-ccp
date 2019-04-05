import React, { Component } from "react";
import { SafeAreaView } from "react-navigation";
import { View, Text, StyleSheet, ScrollView, Animated } from "react-native";
import { connect } from "react-redux";
import { updateDebrisTransactionStatus } from "../../../redux/actions/transaction";

import ParallaxList from "../../../components/ParallaxList";
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
      reason: "",
      dataChanged: false
    };
  }

  _handleSubmit = () => {
    const { reason } = this.state;
    const { transactionId } = this.props.navigation.state.params;
    this.props.fetchUpdateStatus(transactionId, {
      status: "CANCELED",
      cancelReason: reason
    });
    this.props.navigation.goBack();
  };

  _handleInputChanged = (field, value) => {
    this.setState({ dataChanged: true, [field]: value });
  };

  _renderScrollViewItem = () => {
    const { reason } = this.state;
    return (
      <View style={{ paddingHorizontal: 15, marginTop: 15 }}>
        <TextArea
          placeholder={"Input your reason"}
          maxLength={200}
          value={reason}
          onChangeText={value => this._handleInputChanged("reason", value)}
        />
      </View>
    );
  };

  render() {
    const { dataChanged } = this.state;
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "always", top: "always" }}
      >
        <View style={{ flex: 1, flexDirection: "column" }}>
          <ParallaxList
            title={"Edit Profile"}
            hasLeft={true}
            hasCart={false}
            scrollElement={<Animated.ScrollView />}
            renderScrollItem={this._renderScrollViewItem}
          />
          <SafeAreaView
            forceInset={{ bottom: "always" }}
            style={{
              backgroundColor: dataChanged ? colors.secondaryColor : "#a5acb8"
            }}
          >
            <Button
              text={"Submit"}
              onPress={this._handleSubmit}
              disabled={!dataChanged}
              buttonStyle={{ backgroundColor: "transparent" }}
            />
          </SafeAreaView>
        </View>
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
