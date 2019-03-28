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
  listDebrisTransactionBySupplier,
  clearSupplierTransactionList
} from "../../redux/actions/transaction";

import DebrisTab from "./DebrisTab";
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
import { COLORS } from "../../Utils/Constants";

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
    name: "All",
    value: "All"
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

@connect(
  state => {
    return {
      listTransaction: state.transaction.listSupplierTransaction,
      listMaterial: state.transaction.listSupplierMaterial,
      listDebrisTransaction: state.transaction.listSupplierDebris,
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
    fetchListDebris: () => {
      dispatch(listDebrisTransactionBySupplier());
    },
    fetchClearMyTransaction: supplierId => {
      dispatch(clearSupplierTransactionList(supplierId));
    }
  })
)
class MyTransaction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "All",
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
      this.props.fetchListDebris();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { user, isLoggedIn, token } = this.props;
    if (isLoggedIn && prevProps.token !== token) {
      this.props.fetchListMyTransaction(user.contractor.id);
      this.props.fetchListMaterial(user.contractor.id);
      this.props.fetchListDebris();
    }

    console.log("Transaction renderrr");
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
    if (this.state.status === "All") {
      return TRANSACTION_STATUSES;
    } else {
      return TRANSACTION_STATUSES.filter(
        status => status.code === this.state.status.toUpperCase()
      );
    }
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
                  onPress={() =>
                    this.props.navigation.navigate("MyTransactionDetail", {
                      id: item.id
                    })
                  }
                  role={"Requester"}
                  id={item.id}
                  name={item.equipment.name}
                  price={item.equipment.dailyPrice}
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
                  beginDate={item.beginDate}
                  endDate={item.endDate}
                  equipmentStatus={item.equipment.status}
                  hasEquipmentStatus={true}
                  hasStatus={true}
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
              label={"By Status"}
              defaultText={"All"}
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
    const { listTransaction, listMaterial, listDebrisTransaction } = this.props;
    switch (index) {
      case 1:
        return <MaterialTab listMaterial={listMaterial} />;
      case 2:
        return <DebrisTab listDebrisTransaction={listDebrisTransaction} />;
      default:
        return this._renderEquipment(listTransaction);
    }
  };

  render() {
    const { loading, navigation, isLoggedIn } = this.props;
    const { activeTab } = this.state;
    if (!isLoggedIn) {
      return <RequireLogin navigation={navigation} />;
    }

    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "never", top: "always" }}
      >
        <Header>
          <Text style={styles.header}>Contracts</Text>
        </Header>
        <TabView
          tabs={["Equipments", "Materials", "Debris"]}
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
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
  },
  rowWrapper: {
    marginVertical: 8,
    ...colors.shadow,
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
    color: colors.primaryColor,
    fontSize: fontSize.bodyText,
    fontWeight: "600"
  },
  text: {
    fontSize: fontSize.bodyText
  }
});

export default MyTransaction;
