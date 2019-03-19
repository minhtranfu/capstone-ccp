import React, { Component } from "react";
import { SafeAreaView } from "react-navigation";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import { connect } from "react-redux";
import { changeMaterialTransactionRequest } from "../../redux/actions/transaction";
import { Image } from "react-native-expo-image-cache";
import Feather from "@expo/vector-icons/Feather";

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
      loading: state.material.loading
    };
  },
  dispatch => ({
    fetchChangeTransactionStatus: (requestId, request) => {
      dispatch(changeMaterialTransactionRequest(requestId, request));
    }
  })
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
        onPress: () =>
          this.fetchChangeTransactionStatus(transactionId, {
            status: transactionStatus
          })
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
        />
        <Button
          text={"Deny"}
          onPress={() => {
            this._handleChangeTransaction(
              id,
              "DENIED",
              "Are you sure to deny transaction?"
            );
          }}
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
    return (
      <ScrollView>
        <View style={styles.imageWrapper}>
          <Image
            uri={
              "https://www.extremesandbox.com/wp-content/uploads/Extreme-Sandbox-Corportate-Events-Excavator-Lifting-Car.jpg"
            }
            resizeMode={"cover"}
            style={styles.image}
          />
          <View style={{ flexDirection: "column", paddingLeft: 10 }}>
            <Text style={styles.title}>{detail.material.name}</Text>
            <Text style={styles.text}>{detail.material.manufacturer}</Text>
          </View>
        </View>
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
          <Text>Material Detail</Text>
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
    fontSize: fontSize.h4,
    fontWeight: "500"
  },
  title: {
    fontSize: fontSize.h4,
    fontWeight: "400",
    color: colors.text,
    marginBottom: 10
  },
  text: {
    fontSize: fontSize.bodyText,
    fontWeight: "500",
    paddingBottom: 5
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25
  }
});

export default MaterialRequesterDetail;
