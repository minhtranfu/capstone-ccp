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
import { changeMaterialTransactionRequest } from "../../redux/actions/transaction";
import { bindActionCreators } from "redux";
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
      materialDetail: state.transaction.listSupplierMaterial.find(
        item => item.id === id
      ),
      loading: state.material.loading
    };
  },
  dispatch =>
    bindActionCreators(
      { fetchChangeTransactionStatus: changeMaterialTransactionRequest },
      dispatch
    )
)
class MaterialSupplierDetail extends Component {
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
            "Supplier"
          );
          this.props.navigation.goBack();
        }
      }
    ]);
  };

  _renderAcceptedBottom = id => (
    <View style={styles.bottomWrapper}>
      <Button
        text={"Delivery"}
        onPress={() => {
          this._handleChangeTransaction(
            id,
            "DELIVERING",
            "Are you sure you want delivery now?"
          );
        }}
      />
      <Button
        text={"Refuse"}
        onPress={() => {
          this.props.navigation.goBack();
        }}
      />
    </View>
  );

  _renderPendingBottom = id => {
    return (
      <View style={styles.bottomWrapper}>
        <Button
          text={"Accept"}
          onPress={() => {
            this._handleChangeTransaction(
              id,
              "ACCEPTED",
              "Are you sure to accept?"
            );
          }}
          wrapperStyle={{ marginBottom: 15 }}
        />
        <Button
          text={"Cancel order"}
          onPress={() => {
            this._handleChangeTransaction(
              id,
              "DENIED",
              "Are you sure to deny transaction?"
            );
          }}
          wrapperStyle={{ marginBottom: 15 }}
        />
      </View>
    );
  };

  _renderBottomButton = (id, status) => {
    switch (status) {
      case "ACCEPTED":
        return this._renderAcceptedBottom(id);
      case "PENDING":
        return this._renderPendingBottom(id);
      default:
        return null;
    }
  };

  _renderDetail = detail => {
    console.log(detail);
    const image =
      detail.materialTransactionDetails.length > 0
        ? detail.materialTransactionDetails[0].thumbnailImageUrl
        : "https://vollrath.com/ClientCss/images/VollrathImages/No_Image_Available.jpg";
    return (
      <ScrollView contentContainerStyle={{ paddingHorizontal: 15 }}>
        {/* <Image
          uri={image}
          style={{ height: 200, paddingHorizontal: 0 }}
          resizeMode={"cover"}
        /> */}
        <Title title={"Delivering To"} />
        <Text style={styles.text}>{detail.requester.name}</Text>
        <Text style={styles.caption}>{detail.requester.email}</Text>
        <Text style={styles.caption}>{detail.requester.phoneNumber}</Text>
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
            <MaterialTransactionDetail
              imageUrl={item.material.thumbnailImageUrl}
              name={item.material.name}
              manufacturer={item.material.manufacturer}
              price={item.price}
              unit={item.unit}
              quantity={item.quantity}
              description={item.material.description}
            />
          ))
        ) : (
          <Text style={styles.text}>No item/ {detail.totalPrice}K VND</Text>
        )}
        {this._renderBottomButton(detail.id, detail.status)}
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
              <Feather name="x" size={24} />
            </TouchableOpacity>
          )}
        >
          <Text style={styles.text}>Material Detail</Text>
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
  imageWrapper: {
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center"
  },
  image: {
    width: 120,
    height: 80,
    borderRadius: 10
  },
  header: {
    fontSize: fontSize.bodyText,
    fontWeight: "500",
    color: colors.text
  },
  title: {
    fontSize: fontSize.bodyText,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 10
  },
  text: {
    fontSize: fontSize.secondaryText,
    fontWeight: "500",
    color: colors.text,
    paddingBottom: 5
  },
  caption: {
    fontSize: fontSize.secondaryText,
    color: colors.text50,
    fontWeight: "500",
    paddingBottom: 5
  },
  description: {
    fontSize: fontSize.bodyText,
    color: colors.text50,
    fontWeight: "600",
    paddingBottom: 5
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25
  }
});

export default MaterialSupplierDetail;
