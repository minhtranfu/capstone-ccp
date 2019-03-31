import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { SafeAreaView, withNavigation } from "react-navigation";
import { connect } from "react-redux";
import { updateDebrisTransactionStatus } from "../../redux/actions/transaction";
import Feather from "@expo/vector-icons/Feather";

import InputField from "../../components/InputField";
import Bidder from "../../components/Bidder";
import Header from "../../components/Header";
import DebrisSearchItem from "../../components/DebrisSearchItem";
import Button from "../../components/Button";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

const STATUS = {
  PENDING: "OPENING",
  ACCEPTED: "ACCEPTED",
  DELIVERING: "DELIVERING",
  WORKING: "IN PROGRESS",
  FINISHED: "COMPLETED",
  CANCELED: "CANCEL"
};

@connect(
  (state, ownProps) => {
    const { id } = ownProps.navigation.state.params;
    return {
      detail: state.transaction.listSupplierDebris.find(item => item.id === id)
    };
  },
  dispatch => ({
    fetchUpdateStatus: (transactionId, status) => {
      dispatch(updateDebrisTransactionStatus(transactionId, status));
    }
  })
)
class SupplierDebrisDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCancel: false,
      reason: null
    };
  }

  componentWillUnmount() {
    this.setState({ isCancel: false });
  }

  _handleChangeStatus = (transactionId, status) => {
    this.props.fetchUpdateStatus(transactionId, { status: status });
    this.props.navigation.goBack();
  };

  _renderAcceptedCase = id => {
    return (
      <View>
        <Button
          text={"Go working"}
          onPress={() => this._handleChangeStatus(id, "DELIVERING")}
          wrapperStyle={{ marginBottom: 15 }}
        />
        <Button
          text={"Cancel"}
          onPress={() =>
            this.props.navigation.navigate("CancelBid", { transactionId: id })
          }
          wrapperStyle={{ marginBottom: 15 }}
        />
      </View>
    );
  };

  _renderDeliveryCase = id => {
    return (
      <View>
        <Button
          text={"Work"}
          onPress={() => this._handleChangeStatus(id, "WORKING")}
          wrapperStyle={{ marginBottom: 15 }}
        />
        <Button
          text={"Cancel"}
          onPress={() =>
            this.props.navigation.navigate("CancelBid", { transactionId: id })
          }
          wrapperStyle={{ marginBottom: 15 }}
        />
      </View>
    );
  };

  _renderBottomButton = (id, status) => {
    switch (status) {
      case "ACCEPTED":
        return this._renderAcceptedCase(id);
      case "DELIVERING":
        return this._renderDeliveryCase(id);
      default:
        return null;
    }
  };

  _renderContent = () => {
    const { detail } = this.props;
    const { isCancel, reason } = this.state;
    console.log(detail);
    return (
      <View>
        <Text>{detail.debrisPost.title}</Text>
        <Text>{STATUS[detail.status]}</Text>
        {detail.cancelReason ? (
          <Text>Cancel reason: {detail.cancelReason}</Text>
        ) : null}
        <Text>{detail.debrisPost.address}</Text>
        <Bidder
          description={detail.description}
          price={detail.price}
          rating={detail.debrisPost.requester.averageDebrisRating}
          imageUrl={detail.debrisPost.requester.thumbnailImage}
          name={detail.debrisPost.requester.name}
          hasDivider={true}
        />
        {this._renderBottomButton(detail.id, detail.status)}
        {isCancel ? (
          <View>
            <InputField
              label={"Cancel Reason"}
              placeholder={"Input your reason to cancel"}
              customWrapperStyle={{ marginBottom: 20 }}
              inputType="text"
              onChangeText={value => this.setState({ reason: value })}
              value={reason}
              returnKeyType={"next"}
            />
            <Button
              text={"Submit"}
              onPress={() => {
                this.props.fetchUpdateStatus(detail.id, {
                  status: "CANCELED",
                  cancelReason: this.state.reason
                });
                this.setState({ isCancel: false });
                this.props.navigation.goBack();
              }}
            />
          </View>
        ) : null}
      </View>
    );
  };

  render() {
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "always", top: "always" }}
      >
        <Header
          renderLeftButton={() => (
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Feather name="x" size={24} />
            </TouchableOpacity>
          )}
        />
        <ScrollView contentContainerStyle={{ paddingHorizontal: 15 }}>
          {this._renderContent()}
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

export default SupplierDebrisDetail;
