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
      loading: state.material.loading,
      user: state.auth.data
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

  _handleFinished = (transactionId, transactionStatus, transactionTitle) => {
    Alert.alert(transactionTitle, undefined, [
      {
        text: "OK",
        onPress: () =>
          this.fetchChangeTransactionStatus(transactionId, {
            status: transactionStatus
          })
      }
    ]);
  };

  _renderDelivering = id => {
    return (
      <View style={styles.bottomWrapper}>
        <Button
          text={"Receive"}
          onPress={() => {
            this._handleFinished(id, "FINISHED", "Transaction finish!");
          }}
        />
      </View>
    );
  };

  _renderRequesterBottomButton = (id, status) => {
    switch (status) {
      case "DELIVERING":
        return this._renderDelivering(id);
      default:
        return null;
    }
  };

  _renderDetail = detail => {
    //check if contractorId = requesterId => item is belong to requester else item is belong to supplier
    const contractorId = detail.material.contractor.id;
    const requesterId = detail.requester.id;
    const { user } = this.props;
    return (
      <ScrollView contentContainerStyle={{ paddingHorizontal: 15 }}>
        <MaterialTransactionDetail
          imageUrl={detail.material.thumbnailImageUrl}
          name={detail.material.name}
          manufacturer={detail.material.manufacturer}
          contractor={detail.material.contractor.name}
          contractorAvatarUrl={
            "https://microlancer.lancerassets.com/v2/services/bf/56f0a0434111e6aafc85259a636de7/large__original_PAT.jpg"
          }
          price={detail.price}
          unit={detail.unit}
          description={detail.material.description}
          email={detail.material.contractor.email}
          phone={detail.material.contractor.phoneNumber}
          address={detail.materialAddress}
        />

        {this._renderRequesterBottomButton(detail.id, detail.status)}
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
  }
});

export default MaterialRequesterDetail;
