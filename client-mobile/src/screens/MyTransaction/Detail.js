import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Switch,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert
} from "react-native";
import { SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Feather } from "@expo/vector-icons";
import { ImagePicker, Permissions } from "expo";
import {
  getTransactionDetail,
  requestTransaction,
  cancelTransaction
} from "../../redux/actions/transaction";

import InputField from "../../components/InputField";
import Dropdown from "../../components/Dropdown";
import Header from "../../components/Header";
import Button from "../../components/Button";
import Loading from "../../components/Loading";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

const DROPDOWN_GENERAL_TYPES_OPTIONS = [
  {
    id: 0,
    name: "Select general equipment types",
    value: "all"
  }
];

const DROPDOWN_TYPES_OPTIONS = [
  {
    id: 0,
    name: "Select equipment types",
    value: "all"
  }
];

const COLORS = {
  ACCEPTED: "#4DB781", //green
  DENIED: "#FF5C5C", //red
  PENDING: "#FFDF49", //yellow
  PROCESSING: "#7199FE", //blue
  default: "red"
};

@connect(
  (state, ownProps) => {
    const { id } = ownProps.navigation.state.params;
    return {
      transactionDetail: state.transaction.listSupplierTransaction.find(
        item => item.id === id
      )
    };
  },
  dispatch => ({
    fetchRequestTransaction: (id, transactionStatus) => {
      dispatch(requestTransaction(id, transactionStatus));
    },
    fetchCancelTransaction: id => {
      dispatch(cancelTransaction(id));
    }
  })
)
class MyTransactionDetail extends Component {
  _handleRequestTransaction = (id, status) => {
    this.props.fetchRequestTransaction(id, { status: status });
    this.props.navigation.goBack();
  };

  _renderPendingBottom = id => {
    return (
      <View style={styles.bottomWrapper}>
        <Button
          text={"Accept"}
          onPress={() => {
            this._handleRequestTransaction(id, "ACCEPTED");
          }}
        />
        <Button
          text={"Denied"}
          onPress={() => {
            this._handleRequestTransaction(id, "DENIED");
          }}
        />
      </View>
    );
  };

  _showAlert = msg => {
    Alert.alert("Error", msg, [{ text: "OK" }], {
      cancelable: true
    });
  };

  _renderAcceptedBottom = id => (
    <View style={styles.bottomWrapper}>
      <Button
        text={"Delivery"}
        onPress={() => {
          this._handleRequestTransaction(id, "PROCESSING");
        }}
      />
      <Button
        text={"Cancel"}
        onPress={() => {
          this.props.fetchCancelTransaction(id);
          this.props.navigation.goBack();
        }}
      />
    </View>
  );

  _renderProcessingBottom = id => (
    <View style={styles.bottomWrapper}>
      <Button
        text={"FINISH"}
        onPress={() => {
          this._handleRequestTransaction(id, "FINISHED");
        }}
      />
    </View>
  );

  _renderBottomButton = (status, id) => {
    switch (status) {
      case "ACCEPTED":
        return this._renderAcceptedBottom(id);
      case "PENDING":
        return this._renderPendingBottom(id);
      case "PROCESSING":
        return this._renderProcessingBottom(id);
      default:
        return null;
    }
  };

  _renderScrollItem = () => {
    const { id } = this.props.navigation.state.params;
    const { transactionDetail } = this.props;
    return (
      <View style={{ paddingHorizontal: 15 }}>
        <View style={styles.landscapeImgWrapper}>
          <Image
            source={{
              uri:
                "https://www.extremesandbox.com/wp-content/uploads/Extreme-Sandbox-Corportate-Events-Excavator-Lifting-Car.jpg"
            }}
            style={styles.landscapeImg}
            resizeMode={"cover"}
          />
        </View>
        <InputField
          label={"Equipment Name"}
          placeholder={"Input your equipment name"}
          placeholderTextColor={colors.text68}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          editable={false}
          value={transactionDetail.equipment.name}
          returnKeyType={"next"}
        />
        <InputField
          label={"Daily price"}
          placeholderTextColor={colors.text68}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          editable={false}
          value={transactionDetail.dailyPrice.toString()}
          keyboardType={"numeric"}
          returnKeyType={"next"}
        />
        <InputField
          label={"Delivery price"}
          placeholderTextColor={colors.text68}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          editable={false}
          keyboardType={"numeric"}
          value={transactionDetail.deliveryPrice.toString()}
        />
        <InputField
          label={"General Type"}
          placeholderTextColor={colors.text68}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          editable={false}
          value={
            transactionDetail.equipment.equipmentType.generalEquipment.name
          }
        />
        <InputField
          label={"Type"}
          placeholderTextColor={colors.text68}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          editable={false}
          value={transactionDetail.equipment.equipmentType.name}
        />
        <Text style={styles.title}>Available time range</Text>
        <InputField
          label={"From"}
          placeholder={"dd-mm-yyyy"}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          editable={false}
          value={transactionDetail.beginDate}
          returnKeyType={"next"}
        />
        <InputField
          label={"To"}
          placeholder={"dd-mm-yyyy"}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          editable={false}
          value={transactionDetail.endDate}
        />
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 15,
              height: 15,
              backgroundColor: COLORS[transactionDetail.status || "default"]
            }}
          />
          <Text style={styles.text}> Status: {transactionDetail.status}</Text>
        </View>
        {this._renderBottomButton(transactionDetail.status, id)}
      </View>
    );
  };

  render() {
    const { transactionDetail } = this.props;
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "never", top: "always" }}
      >
        <Header
          renderLeftButton={() => (
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.goBack();
              }}
            >
              <Feather name="x" size={24} />
            </TouchableOpacity>
          )}
        >
          <Text style={styles.header}>My Transaction Detail</Text>
        </Header>
        {Object.keys(transactionDetail).length > 0 ? (
          <ScrollView>{this._renderScrollItem()}</ScrollView>
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
  landscapeImgWrapper: {
    height: 200,
    marginBottom: 15
  },
  landscapeImg: {
    flex: 1
  },
  buttonChangeImage: {
    position: "absolute",
    bottom: 15,
    right: 15,
    backgroundColor: colors.primaryColor,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center"
  },
  header: {
    fontSize: fontSize.h4,
    fontWeight: "500"
  },
  title: {
    fontSize: fontSize.bodyText,
    fontWeight: "500",
    color: colors.text
  }
});

export default MyTransactionDetail;
