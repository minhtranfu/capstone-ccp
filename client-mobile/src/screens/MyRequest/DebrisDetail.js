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

import Title from "../../components/Title";
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
      detail: state.transaction.listRequesterDebris.find(
        item => item.id === id
      ),
      feedbackLoading: state.transaction.feedbackLoading
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
      case "ACCEPTED":
        return (
          <Button
            text={"Cancel request"}
            onPress={() =>
              this.props.navigation.navigate("CancelBid", { transactionId })
            }
            wrapperStyle={{ marginTop: 15 }}
          />
        );
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
            style={{ opacity: this.props.feedbackLoading ? 0.5 : 1 }}
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
    console.log(detail);
    const { isCancel } = this.state;
    return (
      <View>
        <Text style={[styles.header, { paddingBottom: 5 }]}>
          {detail.debrisPost.title}
        </Text>
        <Text style={styles.title}>{STATUS[detail.status]}</Text>
        <Text style={styles.description}>
          Address: {detail.debrisPost.address}
        </Text>
        <Title title={"Services required"} />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 5,
            marginBottom: 3
          }}
        >
          <Feather
            name={"tag"}
            size={12}
            style={{ marginRight: 3 }}
            color={colors.text50}
          />
          {detail.debrisPost.debrisServiceTypes &&
            detail.debrisPost.debrisServiceTypes.map(item => (
              <Text
                key={`${item.name || Math.random()}`}
                style={styles.description}
              >
                - {item.name}
              </Text>
            ))}
        </View>
        <Title title={"Employee"} />
        <Bidder
          onPress={() =>
            this.props.navigation.navigate("ContractorProfile", {
              id: detail.debrisPost.requester.id
            })
          }
          feedbackCount={detail.debrisBid.supplier.debrisFeedbacksCount}
          createdTime={detail.debrisBid.createdTime}
          description={detail.debrisBid.description}
          price={detail.debrisBid.price}
          rating={detail.debrisBid.supplier.averageDebrisRating}
          imageUrl={detail.debrisBid.supplier.thumbnailImageUrl}
          name={detail.debrisBid.supplier.name}
        />
        {/* <Text>Total bids {detail.debrisPost.debrisBids.length}</Text>
        {detail.debrisPost.debrisBids.map(item => (
          <Bidder
            feedbackCount={item.supplier.debrisFeedbacksCount}
            createdTime={item.createdTime}
            price={item.price}
            rating={item.supplier.averageDebrisRating}
            imageUrl={item.supplier.thumbnailImage}
            name={item.supplier.name}
          />
        ))} */}
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
          <Text style={styles.header}>Debris Detail</Text>
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
  },
  header: {
    fontSize: fontSize.bodyText,
    fontWeight: "500",
    color: colors.text
  },
  title: {
    fontSize: fontSize.secondaryText,
    fontWeight: "bold",
    color: "#55A7B4",
    paddingBottom: 5
  },
  description: {
    fontSize: fontSize.secondaryText,
    color: colors.text68,
    paddingBottom: 5
  }
});

export default DebrisDetail;
