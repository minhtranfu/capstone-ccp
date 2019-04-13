import React, { Component } from "react";
import { SafeAreaView } from "react-navigation";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { changeMaterialTransactionRequest } from "../../redux/actions/transaction";
import { Image } from "react-native-expo-image-cache";
import Feather from "@expo/vector-icons/Feather";

import Title from "../../components/Title";
import MaterialTransactionDetail from "../../components/MaterialTransactionDetail";
import Loading from "../../components/Loading";
import Header from "../../components/Header";
import Button from "../../components/Button";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

@connect(
  (state, ownProps) => {
    const { id } = ownProps.navigation.state.params;
    return {
      materialDetail: state.transaction.listRequesterMaterial.find(
        item => item.id === id
      ),
      feedbackLoading: state.transaction.feedbackLoading,
      loading: state.material.loading,
      user: state.auth.data
    };
  },
  dispatch =>
    bindActionCreators(
      { fetchChangeTransactionStatus: changeMaterialTransactionRequest },
      dispatch
    )
)
class MaterialRequesterDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    const { materialDetail } = this.props;
    if (!materialDetail) {
      console.log("Fetch detail");
    }
  }

  _handleChangeTransaction = (
    transactionId,
    transactionStatus,
    transactionTitle
  ) => {
    Alert.alert(transactionTitle, undefined, [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel"
      },
      {
        text: "OK",
        onPress: () => {
          this.props.fetchChangeTransactionStatus(
            transactionId,
            {
              status: transactionStatus
            },
            "Requester"
          );
          this.props.navigation.goBack();
        }
      }
    ]);
  };

  _renderDelivering = id => {
    return (
      <View style={styles.bottomWrapper}>
        <Button
          text={"Receive"}
          onPress={() => {
            this._handleChangeTransaction(
              id,
              "FINISHED",
              "Are you sure to receive?"
            );
          }}
          wrapperStyle={{ marginVertical: 15 }}
        />
        <Button
          text={"Deny"}
          onPress={() => {
            this._handleChangeTransaction(
              id,
              "CANCELED",
              "Transaction Cancel!"
            );
          }}
          wrapperStyle={{ marginBottom: 15 }}
        />
      </View>
    );
  };

  _renderCancel = id => {
    return (
      <View style={styles.bottomWrapper}>
        <Button
          text={"Cancel order"}
          onPress={() => {
            this._handleChangeTransaction(
              id,
              "CANCELED",
              "Transaction cancel!"
            );
          }}
          wrapperStyle={{ marginVertical: 15 }}
        />
      </View>
    );
  };

  _renderRequesterBottomButton = (id, status, isFeedback) => {
    switch (status) {
      case "DELIVERING":
        return this._renderDelivering(id);
      case "PENDING":
        return this._renderCancel(id);
      // case "FINISHED":
      //   return isFeedback ? (
      //     <Text style={styles.text}>You've been feedbacked</Text>
      //   ) : (
      //     <Button
      //       text={"Feedback"}
      //       style={{ opacity: this.props.feedbackLoading ? 0.5 : 1 }}
      //       onPress={() =>
      //         this.props.navigation.navigate("Feedback", {
      //           transactionId: id,
      //           type: "Material"
      //         })
      //       }
      //       wrapperStyle={{ marginVertical: 15 }}
      //     />
      //   );
      default:
        return null;
    }
  };

  _renderFeedbackButton = (status, transactionId, isFeedback, materialId) => {
    console.log(status);
    if (status === "FINISHED") {
      return isFeedback ? (
        <Text style={styles.text}>You've been feedbacked for this item</Text>
      ) : (
        <Button
          text={"Feedback"}
          style={{ opacity: this.props.feedbackLoading ? 0.5 : 1 }}
          onPress={() =>
            this.props.navigation.navigate("Feedback", {
              transactionId: transactionId,
              materialId: materialId,
              type: "Material"
            })
          }
          wrapperStyle={{ marginVertical: 15 }}
        />
      );
    }
  };

  _renderDetail = detail => {
    //check if contractorId = requesterId => item is belong to requester else item is belong to supplier
    const { user } = this.props;
    const image =
      detail.materialTransactionDetails.length > 0
        ? detail.materialTransactionDetails[0].thumbnailImageUrl
        : "https://vollrath.com/ClientCss/images/VollrathImages/No_Image_Available.jpg";
    console.log(detail);
    return (
      <ScrollView contentContainerStyle={{ paddingHorizontal: 15 }}>
        {/* <Image
          uri={image}
          style={{ height: 200, paddingHorizontal: 0 }}
          resizeMode={"cover"}
        /> */}
        <Title title={"Supplier Info"} />
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={() =>
            this.props.navigation.navigate("ContractorProfile", {
              id: detail.supplier.id
            })
          }
        >
          <Image
            uri={detail.supplier.thumbnailImageUrl}
            resize={"cover"}
            style={{ width: 60, height: 60, borderRadius: 30, marginRight: 15 }}
          />
          <View>
            <Text style={styles.text}>{detail.supplier.name}</Text>
            <Text style={styles.caption}>{detail.supplier.email}</Text>
            <Text style={styles.caption}>{detail.supplier.phoneNumber}</Text>
          </View>
        </TouchableOpacity>
        <Title title={"Devlivery Address"} />
        <Text style={styles.description}>{detail.requesterAddress}</Text>
        <Title
          title={`Material order ${
            detail.materialTransactionDetails.length > 0
              ? detail.materialTransactionDetails.length
              : 0
          } items`}
        />
        {detail.materialTransactionDetails.length > 0 ? (
          detail.materialTransactionDetails.map(item => (
            <View key={item.id}>
              <MaterialTransactionDetail
                imageUrl={item.material.thumbnailImageUrl}
                name={item.material.name}
                manufacturer={item.material.manufacturer}
                price={item.price}
                unit={item.unit}
                quantity={item.quantity}
                description={item.material.description}
              />
              {this._renderFeedbackButton(
                detail.status,
                detail.id,
                item.feedbacked,
                item.id
              )}
            </View>
          ))
        ) : (
          <Text style={styles.text}>No item/ {detail.totalPrice}K VND</Text>
        )}
        {this._renderRequesterBottomButton(
          detail.id,
          detail.status,
          detail.feedbacked
        )}
      </ScrollView>
    );
  };

  render() {
    const { navigation, materialDetail } = this.props;
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "never", top: "always" }}
      >
        <Header
          renderLeftButton={() => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather name="chevron-left" size={24} />
            </TouchableOpacity>
          )}
        >
          <Text style={styles.title}>Material Detail</Text>
        </Header>
        {Object.keys(materialDetail).length > 0 ? (
          this._renderDetail(materialDetail)
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
  bottomWrapper: {
    marginBottom: 10
  },
  header: {
    fontSize: fontSize.h4,
    fontWeight: "500"
  },
  title: {
    fontSize: fontSize.bodyText,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 10
  },
  text: {
    fontSize: fontSize.bodyText,
    color: colors.text,
    paddingBottom: 5
  },
  caption: {
    fontSize: fontSize.secondaryText,
    color: colors.text50,
    fontWeight: "600",
    paddingBottom: 5
  },
  description: {
    fontSize: fontSize.bodyText,
    color: colors.text50,
    fontWeight: "600",
    paddingBottom: 5
  }
});

export default MaterialRequesterDetail;
