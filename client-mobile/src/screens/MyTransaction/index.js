import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Alert,
  RefreshControl
} from "react-native";
import { SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import { Feather } from "@expo/vector-icons";
import {
  listTransactionBySupplier,
  listMaterialTransactionBySupplier,
  clearSupplierTransactionList
} from "../../redux/actions/transaction";
import { getDebrisBidBySupplier } from "../../redux/actions/debris";

import MyBidsTab from "./MyBidsTab";
import MaterialTab from "./MaterialTab";
import RequireLogin from "../Login/RequireLogin";
import TabView from "../../components/TabView";
import ParallaxList from "../../components/ParallaxList";
import Dropdown from "../../components/Dropdown";
import Button from "../../components/Button";
import TransactionItem from "../../components/TransactionItem";
import EquipmentStatus from "../../components/EquipmentStatus";
import Header from "../../components/Header";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";
import Loading from "../../components/Loading";

const { width, height } = Dimensions.get("window");

const TRANSACTION_STATUSES = [
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
    value: "All Statuses"
  },
  {
    id: 1,
    name: "Pending",
    value: "Pending"
  },
  {
    id: 2,
    name: "Accepted",
    value: "Accepted"
  },
  {
    id: 3,
    name: "Processing",
    value: "Processing"
  },
  {
    id: 4,
    name: "Finished",
    value: "Finished"
  },
  {
    id: 5,
    name: "Denied",
    value: "Denied"
  },
  {
    id: 6,
    name: "Cancel",
    value: "Cancel"
  }
];

const COLORS = {
  AVAILABLE: "#4DB781",
  ACCEPTED: "#4DB781", //green
  DENIED: "#FF5C5C", //red
  CANCEL: "#FF5C5C",
  PENDING: "#F9AA33",
  RENTING: "#7199FE",
  DELIVERING: "#7199FE",
  WAITING_FOR_RETURNING: "#7199FE",
  FINISHED: "#FFDF49",
  PROCESSING: "#7199FE",
  default: "#3E3E3E"
  // blue: 7199FE, yellow: FFDF49
};

const EQUIPMENT_STATUS = {
  AVAILABLE: "Available",
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  CANCEL: "Cancel",
  DELIVERING: "Equipment is on delivering",
  RENTING: "Renting",
  WAITING_FOR_RETURNING: "Equipment is waiting for return",
  FINISHED: "Equipment has been returned"
};

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

@connect(
  state => {
    return {
      listTransaction: state.transaction.listSupplierTransaction,
      listMaterial: state.transaction.listSupplierMaterial,
      listDebrisBids: state.debris.debrisBids,
      loading: state.transaction.loading,
      error: state.transaction.error,
      user: state.auth.data,
      isLoggedIn: state.auth.userIsLoggin,
      token: state.auth.token
    };
  },
  dispatch => ({
    fetchListMyTransaction: contractorId => {
      dispatch(listTransactionBySupplier(contractorId));
    },
    fetchListMaterial: contractorId => {
      dispatch(listMaterialTransactionBySupplier(contractorId));
    },
    fetchClearMyTransaction: supplierId => {
      dispatch(clearSupplierTransactionList(supplierId));
    },
    fetchAllBids: () => {
      dispatch(getDebrisBidBySupplier());
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
      transactionStatus: "",
      refreshing: false,
      activeTab: 0
    };
  }

  componentDidMount() {
    const { user, isLoggedIn } = this.props;
    if (isLoggedIn) {
      this.props.fetchListMyTransaction(user.contractor.id);
      this.props.fetchListMaterial(user.contractor.id);
      this.props.fetchAllBids();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { user, token } = this.props;
    if (prevProps.token !== token) {
      this.props.fetchListMyTransaction(user.contractor.id);
      this.props.fetchListMaterial(user.contractor.id);
      this.props.fetchAllBids();
    }

    console.log("Transaction renderrr");
    // if (status.type === "success" && status.time !== prevProps.status.time) {
    //   this._showAlert("Success", status.message);
    // }
  }

  _showAlert = (title, msg) => {
    Alert.alert(title, msg, [{ text: "OK" }], {
      cancelable: true
    });
  };

  _onChangeTab = tab => {
    this.setState({ activeTab: tab });
  };

  _capitalizeCharacter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  _formatDate = date => {
    let newDate = new Date(date);
    let year = newDate.getFullYear();
    let month = newDate.getMonth() + 1;
    let newMonth = month < 10 ? "0" + month : month;
    let day = newDate.getDate();
    let newDay = day < 10 ? "0" + day : day;
    let dayOfWeek = weekDays[newDate.getDay()];

    return dayOfWeek + ", " + newDay + "/" + newMonth + "/" + year;
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

  _onRefresh = async () => {
    this.setState({ refreshing: true });
    const { user } = this.props;
    const res = await this.props.fetchListMyTransaction(user.contractor.id);
    const materialRes = await this.props.fetchListMaterial(user.contractor.id);
    if (res || materialRes) {
      this.setState({ refreshing: false });
    } else {
      setTimeout(() => {
        this.setState({ refreshing: false });
      }, 1000);
    }
  };

  _handleFilter = () => {
    if (this.state.status === "All Statuses") {
      return TRANSACTION_STATUSES;
    } else {
      return TRANSACTION_STATUSES.filter(
        status => status.code === this.state.status.toUpperCase()
      );
    }
  };

  _renderBottomStatus = (transactionStatus, equipmentStatus) => {
    if (transactionStatus !== "DENIED") {
      return (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 10
          }}
        >
          <View
            style={{
              width: 15,
              height: 15,
              marginRight: 5,
              backgroundColor: COLORS[equipmentStatus || "default"]
            }}
          />
          <Text style={styles.text}>
            Equipment status: {EQUIPMENT_STATUS[equipmentStatus]}
          </Text>
        </View>
      );
    }
    return null;
  };

  _renderAllTransaction = () => (
    <View>
      {this._handleFilter().map((status, idx) => {
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
              <View key={`eq_${item.id}`} style={styles.rowWrapper}>
                <TransactionItem
                  containerStyle={{
                    backgroundColor: "white",
                    borderRadius: 10,
                    padding: 10
                  }}
                  onPress={() =>
                    this.props.navigation.navigate("MyTransactionDetail", {
                      id: item.id
                    })
                  }
                  role={"Requester"}
                  id={item.id}
                  name={item.equipment.name}
                  imageURL={
                    "https://www.extremesandbox.com/wp-content/uploads/Extreme-Sandbox-Corportate-Events-Excavator-Lifting-Car.jpg"
                  }
                  avatarURL={
                    "https://cdn.iconscout.com/icon/free/png-256/avatar-369-456321.png"
                  }
                  status={this._capitalizeCharacter(item.status)}
                  statusBackgroundColor={COLORS[item.status]}
                  contractor={item.requester.name}
                  phone={item.requester.phoneNumber}
                  beginDate={this._formatDate(item.beginDate)}
                  endDate={this._formatDate(item.endDate)}
                  hasEquipmentStatus={this._renderBottomStatus(
                    item.status,
                    item.equipment.status
                  )}
                />
              </View>
            ))}
          </View>
        );
      })}
    </View>
  );

  _renderEquipment = listTransaction => {
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
            {this._renderAllTransaction()}
          </View>
        ) : (
          <Text>No Data</Text>
        )}
      </View>
    );
  };

  _handleActiveTab = index => {
    const { listTransaction, listMaterial, listDebrisBids } = this.props;
    switch (index) {
      case 1:
        return <MaterialTab listMaterial={listMaterial} />;
      case 2:
        return <MyBidsTab listDebrisBids={listDebrisBids} />;
      default:
        return this._renderEquipment(listTransaction);
    }
  };

  render() {
    const { loading, navigation, isLoggedIn } = this.props;
    const { activeTab } = this.state;
    if (isLoggedIn) {
      return (
        <SafeAreaView
          style={styles.container}
          forceInset={{ bottom: "never", top: "always" }}
        >
          <Header>
            <Text style={styles.header}>My Transaction</Text>
          </Header>
          <TabView
            tabs={["Equipment", "Material", "My Bids", "Debris"]}
            onChangeTab={this._onChangeTab}
            activeTab={activeTab}
          />
          {!loading ? (
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={styles.scrollContent}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh}
                />
              }
            >
              {this._handleActiveTab(activeTab)}
            </ScrollView>
          ) : (
            <Loading />
          )}
        </SafeAreaView>
      );
    } else {
      return <RequireLogin navigation={navigation} />;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  rowWrapper: {
    marginVertical: 8,
    shadowColor: "#3E3E3E",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2
  },
  scrollContent: {
    paddingHorizontal: 15,
    paddingBottom: 15
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
  },
  text: {
    fontSize: fontSize.bodyText
  }
});

export default MyTransaction;
