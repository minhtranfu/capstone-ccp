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
import { bindActionCreators } from "redux";
import {
  DROPDOWN_OPTIONS,
  EQUIPMETN_TRANSACTION_STATUSES,
  TABS
} from "../../Utils/Constants";
import i18n from "i18n-js";
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

import MyEquipmentTab from "./MyEquipmentTab";
import MyPostTab from "./MyPostTab";
import MyBidsTab from "./MyBidsTab";
import MaterialTab from "./MaterialTab";
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
  dispatch =>
    bindActionCreators(
      {
        fetchRemoveEquipment: removeEquipment,
        fetchContractorEquipment: getContractorEquipmentList,
        fetchClearMyTransaction: clearSupplierTransactionList,
        fetchGetMaterialList: getMaterialListFromContractor,
        fetchAllBids: getDebrisBidBySupplier,
        fetchGetAllPost: getDebrisArticleByRequester
      },
      dispatch
    )
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
      this.props.fetchContractorEquipment(user.contractor.id, 0);
      this.props.fetchGetMaterialList(user.contractor.id);
      this.props.fetchAllBids();
      this.props.fetchGetAllPost();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { user, token, isLoggedIn } = this.props;
    //Check user is login or not. If yes, fetch data
    if (isLoggedIn && prevProps.token !== token && token) {
      this.props.fetchContractorEquipment(user.contractor.id, 0);
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
    const res = await this.props.fetchContractorEquipment(
      user.contractor.id,
      0
    );
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
    if (user.contractor.status === "ACTIVATED") {
      this.setState({ addModalVisible: true });
    } else {
      this._showAlert(
        "Sorry",
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
      return EQUIPMETN_TRANSACTION_STATUSES;
    } else {
      return EQUIPMETN_TRANSACTION_STATUSES.filter(
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
      listDebrisPost,
      user,
      token,
      isLoggedIn
    } = this.props;
    switch (index) {
      case 1:
        return <MaterialTab listMaterial={listMaterial} />;
      case 2:
        return <MyPostTab listDebrisPost={listDebrisPost} />;
      case 3:
        return <MyBidsTab listDebrisBids={listDebrisBids} />;
      default:
        return <MyEquipmentTab />;
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
              options={DROPDOWN_OPTIONS.EQUIPMENT}
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
            <Text style={styles.header}>{i18n.t("Manage.Name")}</Text>
          </Header>
          <TabView
            tabs={TABS.manage.map(item => i18n.t(`Manage.${item}`))}
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
                style={styles.scrollContent}
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
    flex: 1,
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
