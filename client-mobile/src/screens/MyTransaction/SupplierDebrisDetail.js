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
import Title from "../../components/Title";

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
          wrapperStyle={{ marginTop: 15 }}
        />
        <Button
          text={"Cancel"}
          onPress={() =>
            this.props.navigation.navigate("CancelBid", { transactionId: id })
          }
          wrapperStyle={{ marginTop: 15 }}
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
          wrapperStyle={{ marginTop: 15 }}
        />
        <Button
          text={"Cancel"}
          onPress={() =>
            this.props.navigation.navigate("CancelBid", { transactionId: id })
          }
          wrapperStyle={{ marginTop: 15 }}
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
    const { reason } = this.state;
    console.log(detail);
    return (
      <View>
        <Text style={styles.title}>{detail.debrisPost.title}</Text>
        <Text style={styles.status}>{STATUS[detail.status]}</Text>
        {detail.cancelReason ? (
          <Text style={styles.reason}>
            Cancel reason: {detail.cancelReason}
          </Text>
        ) : null}
        <Text style={styles.text}>Address: {detail.debrisPost.address}</Text>
        <Title title={"Services types"} />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 5
          }}
        >
          {detail.debrisPost.debrisServiceTypes.map(item => (
            <Text style={styles.text}>{item.name}</Text>
          ))}
        </View>
        <Text style={[styles.title, { marginBottom: 0 }]}>
          Total bids ({detail.debrisPost.debrisBids.length})
        </Text>
        <Title title={"Requester"} />
        <Bidder
          description={detail.description}
          price={detail.price}
          rating={detail.debrisPost.requester.averageDebrisRating}
          imageUrl={detail.debrisPost.requester.thumbnailImage}
          name={detail.debrisPost.requester.name}
          hasDivider={true}
        />
        {this._renderBottomButton(detail.id, detail.status)}
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
              <Feather name="chevron-left" size={24} />
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
  },
  title: {
    fontSize: fontSize.bodyText,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 5
  },
  status: {
    fontSize: fontSize.secondaryText,
    fontWeight: "500",
    color: "#55A7B4",
    marginBottom: 5
  },
  reason: {
    fontSize: fontSize.secondaryText,
    color: colors.text50,
    marginBottom: 5
  },
  text: {
    fontSize: fontSize.secondaryText,
    color: colors.text,
    marginBottom: 5
  }
});

export default SupplierDebrisDetail;
