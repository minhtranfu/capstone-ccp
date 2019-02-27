import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Alert
} from "react-native";
import { SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import { Feather } from "@expo/vector-icons";
import { removeEquipment } from "../../redux/actions/equipment";
import {
  listTransactionBySupplierId,
  clearSupplierTransactionList
} from "../../redux/actions/transaction";

import ParallaxList from "../../components/ParallaxList";
import Dropdown from "../../components/Dropdown";
import Button from "../../components/Button";
import EquipmentItem from "./components/EquipmentItem";
import EquipmentStatus from "./components/EquipmentStatus";
import Header from "../../components/Header";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";
import Loading from "../../components/Loading";

const { width, height } = Dimensions.get("window");

const EQUIPMENT_STATUSES = [
  {
    code: "PENDING",
    title: "Pending" // On Waiting,
  },
  {
    code: "ACCEPTED",
    title: "Accepted"
  },
  {
    code: "PROCESSING",
    title: "Processing"
  },
  {
    code: "FINISHED",
    title: "Finished"
  },
  {
    code: "DENIED",
    title: "Denied"
  },
  {
    code: "CANCEL",
    title: "Cancel"
  }
];

const DROPDOWN_OPTIONS = [
  {
    id: 0,
    name: "All Statuses",
    value: "all"
  },
  {
    id: 1,
    name: "Pending",
    value: "PENDING"
  },
  {
    id: 2,
    name: "Accepted",
    value: "ACCEPTED"
  },
  {
    id: 3,
    name: "Processing",
    value: "PROCESSING"
  },
  {
    id: 4,
    name: "Finished",
    value: "FINISHED"
  },
  {
    id: 5,
    name: "Denied",
    value: "DENIED"
  },
  {
    id: 6,
    name: "Cancel",
    value: "CANCEL"
  }
];

@connect(
  state => {
    return {
      listTransaction: state.transaction.listSupplierTransaction,
      loading: state.transaction.loading,
      error: state.transaction.error,
      status: state.status
    };
  },
  dispatch => ({
    fetchListMyTransaction: id => {
      dispatch(listTransactionBySupplierId(id));
    },
    fetchClearMyTransaction: () => {
      dispatch(clearSupplierTransactionList());
    }
  })
)
class MyTransaction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "All Statuses",
      loading: true,
      id: null,
      transactionStatus: ""
    };
  }

  componentDidMount() {
    this.props.fetchListMyTransaction(13);
  }

  componentDidUpdate(prevProps, prevState) {
    const { listTransaction, detail, status } = this.props;
    if (
      listTransaction &&
      prevProps.listTransaction &&
      listTransaction.length !== prevProps.listTransaction.length
    ) {
      this.props.fetchListMyTransaction(13);
    }
  }

  _showAlert = (title, msg) => {
    Alert.alert(title, msg, [{ text: "OK" }], {
      cancelable: true
    });
  };

  _handleOnPressItem = id => {
    this.setState({ id });
  };

  _handleAddPress = () => {
    this.props.navigation.navigate("AddDetail");
  };

  _getEquipementByStatus = status => {
    const { listTransaction } = this.props;
    return listTransaction.filter(item => item.status === status) || [];
  };

  _renderAllTransaction = () => (
    <View>
      {EQUIPMENT_STATUSES.map((status, idx) => {
        const equipmentList = this._getEquipementByStatus(status.code);
        //Hide section if there is no equipment
        if (equipmentList.length === 0) return null;

        // Otherwise, display the whole list
        return (
          <View key={`sec_${idx}`}>
            <EquipmentStatus
              count={equipmentList.length}
              title={status.title}
              code={status.code}
            />
            {equipmentList.map((item, index) => (
              <EquipmentItem
                onPress={() => {
                  this._handleOnPressItem(item.id);
                  this.props.navigation.navigate("MyTransactionDetail", {
                    id: item.id
                  });
                }}
                key={`eq_${index}`}
                id={item.id}
                name={item.equipment.name}
                imageURL={
                  "https://www.extremesandbox.com/wp-content/uploads/Extreme-Sandbox-Corportate-Events-Excavator-Lifting-Car.jpg"
                }
                address={item.equipmentAddress}
                requesterThumbnail={item.requester.thumbnailImage}
                price={item.dailyPrice}
              />
            ))}
          </View>
        );
      })}
    </View>
  );

  _renderFilterTransaction = status => {
    const equipmentList = this._getEquipementByStatus(status.toUpperCase());
    if (equipmentList.length === 0) return null;
    return (
      <View>
        <EquipmentStatus
          count={equipmentList.length}
          title={status}
          code={status.toUpperCase()}
        />

        {equipmentList.map((item, index) => (
          <EquipmentItem
            key={`status${index}`}
            onPress={() => {
              this._handleOnPressItem(item.id);
              this.props.navigation.navigate("MyTransactionDetail", {
                id: item.id
              });
            }}
            id={item.id}
            name={item.equipment.name}
            imageURL={
              "https://www.extremesandbox.com/wp-content/uploads/Extreme-Sandbox-Corportate-Events-Excavator-Lifting-Car.jpg"
            }
            address={item.equipmentAddress}
            requesterThumbnail={item.requester.thumbnailImage}
            price={item.dailyPrice}
          />
        ))}
      </View>
    );
  };

  _renderContent = listTransaction => {
    const { status } = this.state;

    return (
      <View style={styles.scrollWrapper}>
        {listTransaction.length > 0 ? (
          <View>
            <Dropdown
              label={"Filter"}
              defaultText={"All Statuses"}
              onSelectValue={value => this.setState({ status: value })}
              options={DROPDOWN_OPTIONS}
              isHorizontal={true}
            />
            {status === "All Statuses"
              ? this._renderAllTransaction()
              : this._renderFilterTransaction(status)}
          </View>
        ) : (
          <Text>No Data</Text>
        )}
      </View>
    );
  };

  render() {
    const { listTransaction, loading, error, status } = this.props;
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "always", top: "always" }}
      >
        <Header>
          <Text style={styles.header}>My Transaction</Text>
        </Header>
        {!loading ? (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.scrollContent}
          >
            {this._renderContent(listTransaction)}
          </ScrollView>
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
  scrollContent: {
    flex: 0,
    paddingHorizontal: 15,
    paddingTop: 20
  },
  equipmentItemContainer: {
    paddingVertical: 8
  },
  title: {
    fontSize: fontSize.h4,
    fontWeight: "600"
  },
  header: {
    fontSize: fontSize.h4,
    fontWeight: "500",
    color: colors.text
  }
});

export default MyTransaction;
