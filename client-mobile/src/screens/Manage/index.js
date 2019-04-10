import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
  RefreshControl,
  AsyncStorage
} from "react-native";
import { SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import Feather from "@expo/vector-icons/Feather";
import { Image } from "react-native-expo-image-cache";
import {
  getContractorEquipmentList,
  removeEquipment
} from "../../redux/actions/equipment";
import {
  listTransactionBySupplierId,
  clearSupplierTransactionList
} from "../../redux/actions/transaction";
import { getMaterialListFromContractor } from "../../redux/actions/material";
import {
  getDebrisBidBySupplier,
  getDebrisArticleByRequester
} from "../../redux/actions/debris";

import MyPostTab from "./MyPostTab";
import MyBidsTab from "./MyBidsTab";
import MaterialTab from "./components/MaterialTab";
import MaterialSearchItem from "../../components/MaterialSearchItem";
import TabView from "../../components/TabView";
import AddModal from "./components/AddModal";
import RequireLogin from "../Login/RequireLogin";
import ParallaxList from "../../components/ParallaxList";
import Dropdown from "../../components/Dropdown";
import Button from "../../components/Button";
import EquipmentItem from "../../components/EquipmentItem";
import EquipmentStatus from "../../components/EquipmentStatus";
import Header from "../../components/Header";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";
import Loading from "../../components/Loading";

const { width, height } = Dimensions.get("window");

const EQUIPMENT_STATUSES = [
  {
    code: "AVAILABLE",
    title: "Available"
  },
  {
    code: "ACCEPTED",
    title: "Accepted"
  },
  {
    code: "DELIVERING",
    title: "Delivering"
  },
  {
    code: "RENTING",
    title: "Renting" // On Waiting,
  },
  {
    code: "WAITING_FOR_RETURNING",
    title: "Waiting for returning"
  },
  {
    code: "DENIED",
    title: "Denied"
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
    name: "Available",
    value: "Available"
  },
  {
    id: 2,
    name: "Delivering",
    value: "Delivering"
  },
  {
    id: 3,
    name: "Pending",
    value: "Pending"
  },
  {
    id: 4,
    name: "Accepted",
    value: "Accepted"
  },
  {
    id: 5,
    name: "Denied",
    value: "Denied"
  },
  {
    id: 6,
    name: "Waiting to returning",
    value: "waiting"
  }
];

@connect(
  state => {
    return {
      loading: state.equipment.loading,
      listEquipment: state.equipment.contractorEquipment,
      listDebrisBids: state.debris.debrisBids,
      listMaterial: state.material.materialList,
      listDebrisPost: state.debris.debrisArticles,
      user: state.auth.data,
      isLoggedIn: state.auth.userIsLoggin,
      token: state.auth.token
    };
  },
  dispatch => ({
    fetchRemoveEquipment: id => {
      dispatch(removeEquipment(id));
    },
    fetchContractorEquipment: id => {
      dispatch(getContractorEquipmentList(id));
    },
    fetchClearMyTransaction: () => {
      dispatch(clearSupplierTransactionList());
    },
    fetchGetMaterialList: id => {
      dispatch(getMaterialListFromContractor(id));
    },
    fetchAllBids: () => {
      dispatch(getDebrisBidBySupplier());
    },
    fetchGetAllPost: () => {
      dispatch(getDebrisArticleByRequester());
    }
  })
)
class MyEquipment extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      status: "All",
      id: null,
      refreshing: false,
      hasError: false,
      addModalVisible: false,
      activeTab: 0
    };
  }

  componentDidMount() {
    const { user, isLoggedIn } = this.props;
    if (isLoggedIn) {
      this.props.fetchContractorEquipment(user.contractor.id);
      this.props.fetchGetMaterialList(user.contractor.id);
      this.props.fetchAllBids();
      this.props.fetchGetAllPost();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { user, token, isLoggedIn } = this.props;
    //Check user is login or not. If yes, fetch data
    if (isLoggedIn && prevProps.token !== token && token) {
      this.props.fetchContractorEquipment(user.contractor.id);
      this.props.fetchGetMaterialList(user.contractor.id);
      this.props.fetchAllBids();
      this.props.fetchGetAllPost();
    }
  }

  _onChangeTab = tab => {
    this.setState({ activeTab: tab });
  };

  _onRefresh = async () => {
    const { user } = this.props;
    this.setState({ refreshing: true });
    const res = await this.props.fetchContractorEquipment(user.contractor.id);
    const resMaterial = await this.props.fetchGetMaterialList(
      user.contractor.id
    );
    const resBid = await this.props.fetchAllBids();
    const resPost = await this.props.fetchGetAllPost();
    if (res || resMaterial || resBid || resPost) {
      this.setState({ refreshing: false });
    } else {
      setTimeout(() => {
        this.setState({ refreshing: false });
      }, 1000);
    }
  };

  _showAlert = (title, msg) => {
    Alert.alert(title, msg, [{ text: "OK" }], {
      cancelable: true
    });
  };

  _setModalVisible = visible => {
    this.setState({ addModalVisible: visible });
  };

  _handleOnPressItem = id => {
    this.setState({ id });
  };

  _handleOnNavigateBack = transactionStatus => {
    this.setState({ transactionStatus });
  };

  _handleAddButton = () => {
    const { user } = this.props;
    if (user.contractor.status !== "NOT_VERIFIED") {
      this.setState({ addModalVisible: true });
    } else {
      this._showAlert(
        "Nani kore....",
        `Your account is not verified to access this action`
      );
    }
    // this.props.navigation.navigate("AddDetail");
  };

  _getEquipementByStatus = status => {
    const { listEquipment } = this.props;
    return listEquipment.filter(item => item.status === status) || [];
  };

  _handleFilter = () => {
    if (this.state.status === "All") {
      return EQUIPMENT_STATUSES;
    } else {
      return EQUIPMENT_STATUSES.filter(
        status => status.code === this.state.status.toUpperCase()
      );
    }
  };

  _renderAllEquipment = () => (
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
              <EquipmentItem
                onPress={() => {
                  this._handleOnPressItem(item.id);
                  this.props.navigation.navigate("MyEquipmentDetail", {
                    id: item.id
                  });
                }}
                key={`eq_${index}`}
                id={item.id}
                name={item.name}
                imageURL={
                  item.thumbnailImage
                    ? item.thumbnailImage.url
                    : "https://www.extremesandbox.com/wp-content/uploads/Extreme-Sandbox-Corportate-Events-Excavator-Lifting-Car.jpg"
                }
                address={item.address}
                // requesterThumbnail={item.thumbnailImage}
                price={item.dailyPrice}
              />
            ))}
          </View>
        );
      })}
    </View>
  );

  _handleActiveTab = index => {
    const {
      listMaterial,
      listDebrisBids,
      listEquipment,
      listDebrisPost
    } = this.props;
    switch (index) {
      case 1:
        return <MaterialTab listMaterial={listMaterial} />;
      case 2:
        return <MyPostTab listDebrisPost={listDebrisPost} />;
      case 3:
        return <MyBidsTab listDebrisBids={listDebrisBids} />;
      default:
        return this._renderContent(listEquipment);
    }
  };

  _renderContent = listEquipment => {
    return (
      <View style={styles.scrollWrapper}>
        {listEquipment !== 0 ? (
          <View>
            <Dropdown
              label={"By Status"}
              defaultText={"All"}
              onSelectValue={value => this.setState({ status: value })}
              options={DROPDOWN_OPTIONS}
              isHorizontal={true}
            />

            {/* need to optimize */}
            {this._renderAllEquipment()}
          </View>
        ) : (
          <View>
            <Text>No Data</Text>
          </View>
        )}
      </View>
    );
  };

  render() {
    const {
      listEquipment,
      loading,
      status,
      isLoggedIn,
      navigation,
      materialList,
      user
    } = this.props;
    const { activeTab } = this.state;
    if (isLoggedIn) {
      return (
        <SafeAreaView style={styles.container} forceInset={{ top: "always" }}>
          <Header
            renderRightButton={() => (
              <TouchableOpacity onPress={this._handleAddButton}>
                <Feather name="plus" size={22} />
              </TouchableOpacity>
            )}
          >
            <Text style={styles.header}>Manage</Text>
          </Header>
          <TabView
            tabs={["Equipments", "Material", "Posts", "Bids"]}
            onChangeTab={this._onChangeTab}
            activeTab={activeTab}
          />
          <AddModal
            visible={this.state.addModalVisible}
            setModalVisible={this._setModalVisible}
          >
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate("AddDetail");
                this._setModalVisible(false);
              }}
            >
              <Text style={styles.text}>Add new equipment</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate("AddMaterialDetail");
                this._setModalVisible(false);
              }}
            >
              <Text style={[styles.text, { paddingTop: 15 }]}>
                Add new material
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate("AddDebrisPost");
                this._setModalVisible(false);
              }}
            >
              <Text style={[styles.text, { paddingTop: 15 }]}>
                Add new debris post
              </Text>
            </TouchableOpacity>
          </AddModal>
          <View style={{ flex: 1 }}>
            {!loading ? (
              <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh}
                  />
                }
              >
                {this._handleActiveTab(activeTab)}
                {/* {activeTab == 0 ? (
                  this._renderContent(listEquipment)
                ) : (
                  <MaterialTab materialList={materialList} />
                )} */}
              </ScrollView>
            ) : (
              <Loading />
            )}
          </View>
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
  itemWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderWidth: 1,
    borderColor: colors.primaryColor,
    borderRadius: 5,
    marginBottom: 15
  },
  scrollContent: {
    paddingHorizontal: 15
  },
  equipmentItemContainer: {
    paddingVertical: 8
  },
  header: {
    color: colors.primaryColor,
    fontSize: fontSize.bodyText,
    fontWeight: "600"
  },
  title: {
    fontSize: fontSize.h4,
    fontWeight: "600"
  },
  text: {
    fontSize: fontSize.bodyText,
    fontWeight: "500"
  }
});

export default MyEquipment;
