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
import SearchResult from "../screens/Search/SearchResult";
import SearchDetail from "../screens/Search/Detail";
import MyTransaction from "../screens/MyTransaction";
import MyTransactionDetail from "../screens/MyTransaction/Detail";
import EquipmentDetail from "../screens/EquipmentDetail";
import ConfirmTransaction from "../screens/EquipmentDetail/Transaction";
import Activity from "../screens/Activity";
import ActivityDetail from "../screens/Activity/Detail";
import Notification from "../screens/Activity/Notification";
import ButtonWithIcon from "../components/ButtonWithIcon";
import MyEquipment from "../screens/MyEquipment";
import MyEquipmentDetail from "../screens/MyEquipment/Detail";
import AddDetail from "../screens/MyEquipment/AddEquipment/AddDetail";
import AddDuration from "../screens/MyEquipment/AddEquipment/AddDuration";
import AddDurationText from "../screens/MyEquipment/AddEquipment/AddDurationText";
import AddImage from "../screens/MyEquipment/AddEquipment/AddImage";
import RequireLogin from "../screens/Login/RequireLogin";
import ConfirmAdjustDate from "../screens/Activity/ConfirmAdjustDate";
import Cart from "../screens/Cart";
import ConfirmCart from "../screens/Cart/ConfirmCart";
import ContractorProfile from "../screens/Account/ContractorProfile";
import Login from "../screens/Login";
import AuthLoading from "../screens/Login/AuthLoading";

const EquipmentDetailStack = createStackNavigator(
  {
    EquipmentDetail: EquipmentDetail
  },
  {
    headerMode: "none"
  }
);

const DiscoverStack = createStackNavigator(
  {
    Discover: Discover,
    Detail: EquipmentDetail,
    ConfirmTransaction: ConfirmTransaction,
    Search: Search,
    Result: SearchResult,
    SearchDetail: SearchDetail,
    Cart: Cart,
    ConfirmCart: ConfirmCart
  },
  {
    headerMode: "none"
  }
);

DiscoverStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;

  let routeName = navigation.state.routes[navigation.state.index].routeName;

  if (routeName == "SearchDetail") {
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
    ConstructionDetail: ConstructionDetail
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
    AddDurationText: AddDurationText,
    AddImage: AddImage
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
    Login: Login
  },
  {
    mode: "modal",
    headerMode: "none",
    initialRouteName: "MyEquipment"
  }
);

MyEquipmentStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;

  let routeName = navigation.state.routes[navigation.state.index].routeName;

  if (routeName == "AddNewEquipment") {
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
    ContractorProfile: ContractorProfile,
    Login: Login
  },
  {
    mode: "modal",
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
    ContractorProfile: ContractorProfile
  },
  {
    mode: "modal",
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
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let icon;
        if (routeName === "Discover") {
          icon = focused
            ? require("../../assets/icons/icons8-compass-active.png")
            : require("../../assets/icons/icons8-compass.png");
        } else if (routeName === "Activity") {
          icon = focused
            ? require("../../assets/icons/icons8-activity-active.png")
            : require("../../assets/icons/icons8-activity.png");
        } else if (routeName === "Equipment") {
          icon = focused
            ? require("../../assets/icons/icons8-garage-active.png")
            : require("../../assets/icons/icons8-garage.png");
        } else if (routeName === "Transaction") {
          icon = focused
            ? require("../../assets/icons/icons8-transaction-active.png")
            : require("../../assets/icons/icons8-transaction.png");
        } else if (routeName === "Account") {
          icon = focused
            ? require("../../assets/icons/icons8-settings-active.png")
            : require("../../assets/icons/icons8-settings.png");
        }

        return (
          <Image
            source={icon}
            style={{
              height: 28,
              aspectRatio: 1,
              marginTop: 2
            }}
            resizeMode={"contain"}
          />
        );
      }
    }),
    tabBarOptions: {
      showLabel: false,
      activeTintColor: colors.secondaryColor,
      inactiveTintColor: colors.white,
      style: {
        backgroundColor: colors.primaryColor
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
