import React, { Component } from "react";
import { Image } from "react-native";
import {
  createBottomTabNavigator,
  createStackNavigator,
  createSwitchNavigator,
  createAppContainer
} from "react-navigation";
import DismissableStackNav from "../Utils/DismissableStackNav";
import colors from "./colors";

import Discover from "../screens/Discover";
import Account from "../screens/Account";
import Profile from "../screens/Account/Profile";
import Construction from "../screens/Account/Construction";
import ConstructionDetail from "../screens/Account/Detail";
import CallOrTextUs from "../screens/Account/CallOrTextUs";
import AboutUs from "../screens/Account/AboutUs";
import Search from "../screens/Search";
import EquipmentResult from "../screens/Search/EquipmentResult";
import SearchDetail from "../screens/Search/Detail";
import MyTransaction from "../screens/MyTransaction";
import MyTransactionDetail from "../screens/MyTransaction/Detail";
import ConfirmTransaction from "../screens/Transaction/ConfirmTransaction";
import Activity from "../screens/MyRequest";
import ActivityDetail from "../screens/MyRequest/Detail";
import Notification from "../screens/MyRequest/Notification";
import MyEquipment from "../screens/Manage";
import MyEquipmentDetail from "../screens/Manage/Detail";
import AddDetail from "../screens/Manage/AddEquipment/AddDetail";
import AddDuration from "../screens/Manage/AddEquipment/AddDuration";
import AddImage from "../screens/Manage/AddEquipment/AddImage";
import RequireLogin from "../screens/Login/RequireLogin";
import ConfirmAdjustDate from "../screens/MyRequest/ConfirmAdjustDate";
import Cart from "../screens/Cart";
import ConfirmCart from "../screens/Cart/ConfirmCart";
import ContractorProfile from "../screens/Account/ContractorProfile";
import Login from "../screens/Login";
import AuthLoading from "../screens/Login/AuthLoading";
import MaterialSearch from "../screens/Search/MaterialSearch";
import AddMaterialDetail from "../screens/Manage/AddMaterial/AddMaterialDetail";
import MaterialResult from "../screens/Search/MaterialResult";
import MaterialDetail from "../screens/Search/MaterialDetail";
import MaterialTransaction from "../screens/Transaction/MaterialTransaction";
import MaterialTab from "../screens/MyTransaction/MaterialTab";
import MaterialSupplierDetail from "../screens/MyTransaction/MaterialSupplierDetail";
import MaterialRequesterDetail from "../screens/MyRequest/MaterialRequesterDetail";
import MyMaterialDetail from "../screens/Manage/MaterialDetail";
import AddDebrisPost from "../screens/Manage/AddDebrisPost";
import MyPostDetail from "../screens/Manage/MyPostDetail";
import AddServicesTypes from "../screens/Manage/AddServicesTypes";
import BidSearch from "../screens/Search/BidSearch";
import BidResult from "../screens/Search/BidResult";
import MyBidsDetail from "../screens/Manage/MyBidsDetail";
import BidDetail from "../screens/Search/BidDetail";
import ConfirmBid from "../screens/Transaction/ConfirmBid";
import Subscription from "../screens/Account/Subscription";
import DebrisDetail from "../screens/MyRequest/DebrisDetail";
import SupplierDebrisDetail from "../screens/MyTransaction/SupplierDebrisDetail";
import Feedback from "../screens/MyRequest/Feedback";
import AddSubscription from "../screens/Account/AddSubscription";
import CancelBid from "../screens/MyTransaction/components/CancelBid";
import EditSubscription from "../screens/Account/EditSubscription";
import Register from "../screens/Login/Register";
// import MaterialTransactionDetail from "../components/MaterialTransactionDetail";

const DiscoverStack = createStackNavigator(
  {
    Discover: Discover,
    ConfirmTransaction: ConfirmTransaction,
    Search: Search,
    Result: EquipmentResult,
    SearchDetail: SearchDetail,
    Cart: Cart,
    ConfirmCart: ConfirmCart,
    MaterialSearch: MaterialSearch,
    MaterialResult: MaterialResult,
    MaterialDetail: MaterialDetail,
    BidSearch: BidSearch,
    BidResult: BidResult,
    BidDetail: BidDetail,
    ConfirmBid: ConfirmBid,
    ConfirmMaterial: MaterialTransaction
  },
  {
    headerMode: "none"
  }
);

DiscoverStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;

  let routeName = navigation.state.routes[navigation.state.index].routeName;

  if (
    routeName == "SearchDetail" ||
    routeName == "MaterialDetail" ||
    routeName == "BidDetail" ||
    routeName == "ConfirmBid"
  ) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible
  };
};

const AuthStack = createStackNavigator(
  {
    Login: Login
  },
  {
    headerMode: "none"
  }
);

const AccountStack = createStackNavigator(
  {
    Account: Account,
    Profile: Profile,
    CallOrTextUs: CallOrTextUs,
    AboutUs: AboutUs,
    Construction: Construction,
    ConstructionDetail: ConstructionDetail,
    Subcription: Subscription,
    AddSubscription: AddSubscription,
    EditSubscription: EditSubscription,
    Register: Register
    // AuthLoading: AuthLoading,
    // Auth: AuthStack
  },
  {
    initialRouteName: "Account",
    headerMode: "none"
  }
);

const AddNewEquipmentStack = DismissableStackNav(
  {
    AddDetail: AddDetail,
    AddDuration: AddDuration,
    AddImage: AddImage,
    AddMaterialDetail: AddMaterialDetail
  },
  {
    headerMode: "none",
    initialRouteName: "AddDetail"
  }
);

const MyEquipmentStack = createStackNavigator(
  {
    MyEquipment: MyEquipment,
    MyEquipmentDetail: MyEquipmentDetail,
    AddNewEquipment: AddNewEquipmentStack,
    MyMaterialDetail: MyMaterialDetail,
    MyPostDetail: MyPostDetail,
    MyBidsDetail: MyBidsDetail,
    AddDebrisPost: AddDebrisPost,
    AddServicesTypes: AddServicesTypes,
    Login
  },
  {
    headerMode: "none",
    initialRouteName: "MyEquipment"
  }
);

MyEquipmentStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;

  let routeName = navigation.state.routes[navigation.state.index].routeName;

  if (routeName == "AddNewEquipment" || routeName == "MyPostDetail") {
    tabBarVisible = false;
  }

  return {
    tabBarVisible
  };
};

const MyTransactionStack = createStackNavigator(
  {
    MyTransaction: MyTransaction,
    MyTransactionDetail: MyTransactionDetail,
    MaterialSupplierDetail: MaterialSupplierDetail,
    ContractorProfile: ContractorProfile,
    SupplierDebrisDetail: SupplierDebrisDetail,
    Login,
    Feedback: Feedback,
    CancelBid: CancelBid
  },
  {
    headerMode: "none",
    initialRouteName: "MyTransaction"
  }
);

const ActivityStack = createStackNavigator(
  {
    Activity: Activity,
    Notification: Notification,
    Detail: ActivityDetail,
    ConfirmAdjustDate: ConfirmAdjustDate,
    ContractorProfile: ContractorProfile,
    MaterialRequesterDetail: MaterialRequesterDetail,
    DebrisDetail: DebrisDetail,
    LoginModal: Login,
    Feedback: Feedback,
    CancelBid: CancelBid
  },
  {
    headerMode: "none",
    initialRouteName: "Activity"
  }
);

const TabNavigator = createBottomTabNavigator(
  {
    Discover: DiscoverStack,
    Activity: ActivityStack,
    Equipment: MyEquipmentStack,
    Transaction: MyTransactionStack,
    Account: AccountStack
  },
  {
    initialRouteName: "Discover",
    defaultNavigationOptions: ({ navigation }) => {
      const { routeName, index, routes } = navigation.state;
      let tabBarVisible = true;

      if (
        routes &&
        (routes[index].routeName === "Profile" ||
          routes[index].routeName === "LoginModal" ||
          routes[index].routeName === "Feedback")
      ) {
        tabBarVisible = false;
      }
      return {
        tabBarVisible,
        tabBarIcon: ({ focused, horizontal, tintColor }) => {
          const { routeName } = navigation.state;
          let icon;
          if (routeName === "Discover") {
            icon = require("../../assets/icons/icons8-compass.png");
          } else if (routeName === "Activity") {
            icon = require("../../assets/icons/icons8-activity.png");
          } else if (routeName === "Equipment") {
            icon = require("../../assets/icons/icons8-garage.png");
          } else if (routeName === "Transaction") {
            icon = require("../../assets/icons/icons8-transaction.png");
          } else if (routeName === "Account") {
            icon = require("../../assets/icons/icons8-settings.png");
          }

          return (
            <Image
              source={icon}
              style={{
                height: 28,
                aspectRatio: 1,
                marginTop: 2,
                tintColor: focused ? colors.secondaryColor : "#a5acb8"
              }}
            />
          );
        }
      };
    },
    tabBarOptions: {
      showLabel: false,
      activeTintColor: colors.secondaryColor,
      inactiveTintColor: colors.white,
      style: {
        backgroundColor: "#fcfcfc"
      }
    }
  }
);

const AppNavigator = createSwitchNavigator(
  {
    // Auth: AuthStack,
    // AuthLoading: AuthLoading,
    App: TabNavigator
  },
  { initialRouteName: "App" }
);

export default createAppContainer(AppNavigator);
