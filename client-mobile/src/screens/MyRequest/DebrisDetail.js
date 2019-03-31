import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { connect } from "react-redux";
import { SafeAreaView } from "react-navigation";
import { updateDebrisTransactionStatus } from "../../redux/actions/transaction";
import Feather from "@expo/vector-icons/Feather";

import Bidder from "../../components/Bidder";
import DebrisBid from "./components/DebrisBid";
import Header from "../../components/Header";
import Loading from "../../components/Loading";
import DebrisSearchItem from "../../components/DebrisSearchItem";
import Button from "../../components/Button";
import InputField from "../../components/InputField";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

const STATUS = {
  PENDING: "OPENING",
  ACCEPTED: "ACCEPTED",
  DELIVERING: "DELIVERING",
  WORKING: "IN PROGRESS",
  FINISHED: "COMPLETED",
  CANCELED: "DONE"
};

@connect(
  (state, ownProps) => {
    const { id } = ownProps.navigation.state.params;
    return {
      detail: state.transaction.listRequesterDebris.find(item => item.id === id)
    };
  },
  dispatch => ({
    fetchUpdateStatus: (transactionId, status) => {
      dispatch(updateDebrisTransactionStatus(transactionId, status));
    }
  })
)
class DebrisDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCancel: false,
      reason: null,
      modalVisible: false
    };
  }
  _setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  _handleChangeStatus = (transactionId, status) => {
    this.props.fetchUpdateStatus(transactionId, { status: status });
    this.props.navigation.goBack();
  };

  _renderBottomButton = (transactionId, status, isFeedback) => {
    switch (status) {
      case "WORKING":
        return (
          <Button
            text={"Finish"}
            onPress={() => this._handleChangeStatus(transactionId, "FINISHED")}
          />
        );
      case "FINISHED":
        return isFeedback ? (
          <Text style={styles.text}>You've been feedbacked</Text>
        ) : (
          <Button
            text={"Feedback"}
            onPress={() =>
              this.props.navigation.navigate("Feedback", {
                transactionId: transactionId,
                type: "Debris"
              })
            }
          />
        );
      default:
        return null;
    }
  };

  _renderContent = () => {
    const { detail } = this.props;
    const { isCancel } = this.state;
    return (
      <View>
        <Text>{detail.debrisPost.title}</Text>
        <Text>{STATUS[detail.status]}</Text>
        <Text>{detail.debrisPost.address}</Text>
        <Bidder
          description={detail.debrisBid.description}
          price={detail.debrisBid.price}
          rating={detail.debrisBid.supplier.averageDebrisRating}
          imageUrl={detail.debrisBid.supplier.thumbnailImage}
          name={detail.debrisBid.supplier.name}
          hasDivider={true}
        />
        {this._renderBottomButton(detail.id, detail.status, detail.feedbacked)}
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
                this.props.fetchUpdateStatus({
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
    const { navigation } = this.props;
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "always", top: "always" }}
      >
        <Header
          renderLeftButton={() => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather name={"chevron-left"} size={24} />
            </TouchableOpacity>
          )}
        >
          <Text>Debris Detail</Text>
        </Header>
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

export default DebrisDetail;
