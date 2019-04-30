import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  TouchableOpacity,
  ScrollView,
  FlatList,
  RefreshControl
} from "react-native";
import { SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  listTransactionByRequester,
  listMaterialTransactionByRequester,
  listDebrisTransactionByRequester
} from "../../redux/actions/transaction";
import {
  countTotalNotification,
  getAllNotification
} from "../../redux/actions/notification";
import RequireLogin from "../Login/RequireLogin";
import Feather from "@expo/vector-icons/Feather";
import i18n from "i18n-js";
import {
  DROPDOWN_OPTIONS,
  TRANSACTION_STATUSES,
  TABS
} from "../../Utils/Constants";

import DebrisTab from "./DebrisTab";
import MaterialTab from "./MaterialTab";
import TabView from "../../components/TabView";
import Button from "../../components/Button";
import Loading from "../../components/Loading";
import Header from "../../components/Header";
import Dropdown from "../../components/Dropdown";
import EquipmentStatus from "../../components/EquipmentStatus";
import TransactionItem from "../../components/TransactionItem";
import EquipmentItem from "./components/EquipmentItem";
import StepProgress from "./components/StepProgress";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";
import DebrisItem from "../../components/DebrisItem";
import DebrisSearchItem from "../../components/DebrisSearchItem";
import { COLORS } from "../../Utils/Constants";

const EQUIPMENT_STATUS = {
  AVAILABLE: "Available",
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  CANCEL: "Cancel",
  DELIVERING: "Delivering",
  RENTING: "Renting",
  WAITING_FOR_RETURNING: "Returning",
  FINISHED: "Returned"
};

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

@connect(
  state => {
    console.log(state.notification);
    return {
      isLoggedIn: state.auth.userIsLoggin,
      loading: state.transaction.loading,
      listTransaction: state.transaction.listRequesterTransaction,
      listMaterial: state.transaction.listRequesterMaterial,
      listDebrisTransaction: state.transaction.listRequesterDebris,
      user: state.auth.data,
      token: state.auth.token,
      countNotification: state.notification.countNotification
    };
  },
  dispatch =>
    bindActionCreators(
      {
        fetchRequesterTransaction: listTransactionByRequester,
        fetchRequesterMaterial: listMaterialTransactionByRequester,
        fetchGetRequesterDebris: listDebrisTransactionByRequester
      },
      dispatch
    )
)
class MyRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      status: "All Statuses",
      refreshing: false,
      activeTab: 0
    };
  }

  componentDidMount() {
    const { user, isLoggedIn } = this.props;
    if (isLoggedIn) {
      this.props.fetchRequesterTransaction(user.contractor.id);
      this.props.fetchRequesterMaterial(user.contractor.id);
      this.props.fetchGetRequesterDebris();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { user, token } = this.props;
    if (prevProps.token !== token && token) {
      this.props.fetchRequesterTransaction(user.contractor.id);
      this.props.fetchRequesterMaterial(user.contractor.id);
      this.props.fetchGetRequesterDebris();
    }
  }

  _capitalizeCharacter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  _onChangeTab = tab => {
    this.setState({ activeTab: tab });
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

  _handleFilterStatusResult = status => {
    const { listTransaction } = this.props;
    if (listTransaction) {
      return listTransaction.filter(item => item.status === status) || [];
    }
    return [];
  };

  _onRefresh = async () => {
    const { user } = this.props;
    this.setState({ refreshing: true });
    const res = await this.props.fetchRequesterTransaction(user.contractor.id);
    const materialRes = await this.props.fetchRequesterMaterial(
      user.contractor.id
    );
    const debrisRes = await this.props.fetchGetRequesterDebris();
    if (res || materialRes || debrisRes) {
      this.setState({ refreshing: false });
    } else {
      setTimeout(() => {
        this.setState({ refreshing: false });
      }, 1000);
    }
  };

  _renderContent = listTransaction => {
    const { selectedIndex } = this.state;
    if (listTransaction.length > 0) {
      return this._renderRequesterItemList();
    }
    return (
      <View style={styles.actionWrapper}>
        <Text style={styles.text}>No data</Text>
      </View>
    );
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

  _renderBottomStatus = (status, equipmentStatus) => {
    switch (status) {
      case "PROCESSING":
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
                borderRadius: 5,
                backgroundColor: COLORS[equipmentStatus || "default"]
              }}
            />
            <Text style={styles.text}>
              Status: {EQUIPMENT_STATUS[equipmentStatus]}
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  _renderRequesterItemList = () => {
    return (
      <View style={{ flex: 1 }}>
        <Dropdown
          label={"Filter"}
          defaultText={"All Statuses"}
          onSelectValue={value => this.setState({ status: value })}
          options={DROPDOWN_OPTIONS.REQUEST}
          isHorizontal={true}
        />
        <View>
          {this._handleFilter().map((status, idx) => {
            const equipmentList = this._handleFilterStatusResult(status.code);
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
                        this.props.navigation.navigate("Detail", {
                          id: item.id
                        })
                      }
                      id={item.id}
                      role={"Supplier"}
                      name={item.equipment.name}
                      equipmentStatus={item.equipment.status}
                      imageURL={
                        item.equipment.thumbnailImage
                          ? item.equipment.thumbnailImage.url
                          : "https://www.extremesandbox.com/wp-content/uploads/Extreme-Sandbox-Corportate-Events-Excavator-Lifting-Car.jpg"
                      }
                      avatarURL={
                        "https://cdn.iconscout.com/icon/free/png-256/avatar-369-456321.png"
                      }
                      status={this._capitalizeCharacter(item.status)}
                      statusBackgroundColor={COLORS[item.status]}
                      contractor={item.equipment.contractor.name}
                      phone={item.equipment.contractor.phoneNumber}
                      beginDate={item.beginDate}
                      endDate={item.endDate}
                      role={"Supplier"}
                      price={item.equipment.dailyPrice}
                      hasEquipmentStatus={true}
                      hasStatus={true}
                    />
                  </View>
                ))}
              </View>
            );
          })}
        </View>
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
        return this._renderContent(listTransaction);
    }
  };

  _showNotificationIcon = () => {
    return (
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate("Notification")}
      >
        <Feather name="bell" size={20} />
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#FF0000",
            borderRadius: 5,
            width: 13,
            position: "absolute",
            top: 1,
            right: 1,
            margin: -1
          }}
        >
          <Text
            style={{
              color: "white",

              textAlign: "center",
              fontSize: 9
            }}
          >
            {this.props.countNotification}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const { navigation, isLoggedIn, loading, status } = this.props;
    const { activeTab } = this.state;
    console.log(this.props.countNotification);
    if (isLoggedIn) {
      return (
        <SafeAreaView style={styles.container} forceInset={{ top: "always" }}>
          <Header renderRightButton={this._showNotificationIcon}>
            <Text style={styles.header}>{i18n.t("MyRequest.Name")}</Text>
          </Header>
          <TabView
            tabs={TABS.transaction.map(item => i18n.t(`MyRequest.${item}`))}
            onChangeTab={this._onChangeTab}
            activeTab={activeTab}
          />
          {!loading ? (
            <ScrollView
              contentContainerStyle={styles.scrollContentContainer}
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
  scrollContentContainer: {
    paddingHorizontal: 15,
    paddingBottom: 15
  },
  rowWrapper: {
    marginVertical: 8,
    ...colors.shadow,
    elevation: 2
  },
  actionWrapper: {
    justifyContent: "center",
    alignItems: "center",
    height: "35%",
    borderRadius: 9,
    borderStyle: "dashed",
    borderWidth: 3,
    borderColor: "#DEE4E3",
    padding: 30
  },
  header: {
    color: colors.primaryColor,
    fontSize: fontSize.bodyText,
    fontWeight: "600"
  },
  text: {
    fontSize: fontSize.bodyText,
    fontWeight: "500"
  }
});

export default MyRequest;
