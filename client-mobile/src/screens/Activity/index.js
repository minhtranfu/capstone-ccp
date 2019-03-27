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
import {
  listTransactionByRequester,
  listMaterialTransactionByRequester,
  listDebrisTransactionByRequester
} from "../../redux/actions/transaction";
import { getDebrisArticleByRequester } from "../../redux/actions/debris";
import { isSignedIn } from "../../config/auth";
import RequireLogin from "../Login/RequireLogin";
import Feather from "@expo/vector-icons/Feather";

import DebrisTab from "./DebrisTab";
import DebrisArticleTab from "./DebrisArticleTab";
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
  }
];

const TRANSACTION_STATUSES = [
  {
    code: "PENDING",
    title: "Pending"
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
  }
];

const EQUIPMENT_STATUS = {
  AVAILABLE: "Available",
  PENDING: "Wait for supplier accept",
  ACCEPTED: "Supplier has been accepted",
  CANCEL: "Requester has been canceled",
  DELIVERING: "Equipment is on delivering",
  RENTING: "Renting",
  WAITING_FOR_RETURNING: "Equipment is turning back",
  FINISHED: "Equipment has been returned"
};

const COLORS = {
  AVAILABLE: "#4DB781",
  ACCEPTED: "#4DB781", //green
  DENIED: "#FF5C5C", //red
  CANCEL: "#FF5C5C",
  PENDING: "#F9AA33",
  DELIVERING: "#7199FE",
  RENTING: "#7199FE",
  WAITING_FOR_RETURNING: "#7199FE",
  FINISHED: "#FFDF49",
  PROCESSING: "#7199FE",
  default: "#3E3E3E"
  // blue: 7199FE, yellow: FFDF49
};

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

@connect(
  state => {
    return {
      isLoggedIn: state.auth.userIsLoggin,
      loading: state.transaction.loading,
      listTransaction: state.transaction.listRequesterTransaction,
      listMaterial: state.transaction.listRequesterMaterial,
      listDebrisTransaction: state.transaction.listRequesterDebris,
      listDebrisArticle: state.debris.debrisArticles,
      user: state.auth.data,
      token: state.auth.token
    };
  },
  dispatch => ({
    fetchRequesterTransaction: contractorId => {
      dispatch(listTransactionByRequester(contractorId));
    },
    fetchRequesterMaterial: contractorId => {
      dispatch(listMaterialTransactionByRequester(contractorId));
    },
    fetchGetRequesterDebris: () => {
      dispatch(listDebrisTransactionByRequester());
    },
    fetchGetDebrisArticleByRequester: () => {
      dispatch(getDebrisArticleByRequester());
    }
  })
)
class Activity extends Component {
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
      this.props.fetchGetDebrisArticleByRequester();
      this.props.fetchGetRequesterDebris();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { user, token } = this.props;
    if (prevProps.token !== token && token) {
      this.props.fetchRequesterTransaction(user.contractor.id);
      this.props.fetchRequesterMaterial(user.contractor.id);
      this.props.fetchGetDebrisArticleByRequester();
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
      // case "FINISHED":
      //   return (
      //     <Button
      //       text={"Feedback"}
      //       wrapperStyle={{
      //         paddingHorizontal: 15,
      //         alignItems: "center",
      //         justifyContent: "center"
      //       }}
      //       buttonStyle={{
      //         height: 35,
      //         width: 120
      //       }}
      //     />
      //   );
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
          options={DROPDOWN_OPTIONS}
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
                      name={item.equipment.name}
                      imageURL={
                        "https://www.extremesandbox.com/wp-content/uploads/Extreme-Sandbox-Corportate-Events-Excavator-Lifting-Car.jpg"
                      }
                      avatarURL={
                        "https://cdn.iconscout.com/icon/free/png-256/avatar-369-456321.png"
                      }
                      status={this._capitalizeCharacter(item.status)}
                      statusBackgroundColor={COLORS[item.status]}
                      contractor={item.equipment.contractor.name}
                      phone={item.equipment.contractor.phoneNumber}
                      beginDate={this._formatDate(item.beginDate)}
                      endDate={this._formatDate(item.endDate)}
                      role={"Supplier"}
                    />
                    {this._renderBottomStatus(
                      item.status,
                      item.equipment.status
                    )}
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
    const {
      listTransaction,
      listMaterial,
      listDebrisArticle,
      listDebrisTransaction
    } = this.props;
    switch (index) {
      case 1:
        return <MaterialTab listMaterial={listMaterial} />;
      case 2:
        return <DebrisArticleTab listDebrisArticle={listDebrisArticle} />;
      case 3:
        return <DebrisTab listDebrisTransaction={listDebrisTransaction} />;

      default:
        return this._renderContent(listTransaction);
    }
  };

  render() {
    const { navigation, isLoggedIn, loading, status } = this.props;
    const { activeTab } = this.state;
    if (isLoggedIn) {
      return (
        <SafeAreaView
          style={styles.container}
          forceInset={{ bottom: "always", top: "always" }}
        >
          <Header
            renderLeftButton={() => (
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("Notification")}
              >
                <Feather name="bell" size={24} />
              </TouchableOpacity>
            )}
            renderRightButton={() => (
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate("AddDebrisArticle")
                }
              >
                <Feather name="plus" size={24} />
              </TouchableOpacity>
            )}
          >
            <Text style={styles.header}>My Request</Text>
          </Header>
          <TabView
            tabs={["Equipment", "Material", "My Posts", "Debris"]}
            onChangeTab={this._onChangeTab}
            activeTab={activeTab}
          />
          {!loading ? (
            <ScrollView
              style={{ flex: 1 }}
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
    shadowColor: "#3E3E3E",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
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
    fontSize: fontSize.h4,
    fontWeight: "500"
  },
  text: {
    fontSize: fontSize.bodyText,
    fontWeight: "500"
  }
});

export default Activity;
