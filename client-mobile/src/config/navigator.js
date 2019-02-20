import React, { Component } from "react";
import { Image, StyleSheet } from "react-native";
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
import Search from "../screens/Search";
import SearchResult from "../screens/Search/SearchResult";
import MyTransaction from "../screens/MyTransaction";
import AddDetail from "../screens/MyTransaction/AddEquipment/AddDetail";
import AddDuration from "../screens/MyTransaction/AddEquipment/AddDuration";
import AddDurationText from "../screens/MyTransaction/AddEquipment/AddDurationText";
import AddImage from "../screens/MyTransaction/AddEquipment/AddImage";
import EquipmentDetail from "../screens/EquipmentDetail";
import Transaction from "../screens/EquipmentDetail/Transaction";
import MyTransactionDetail from "../screens/MyTransaction/Detail";
import Activity from "../screens/Activity";
import ActivityDetail from "../screens/Activity/Detail";
import Notification from "../screens/Activity/Notification";
import ButtonWithIcon from "../components/ButtonWithIcon";

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
    Transaction: Transaction,
    Search: Search,
    Result: SearchResult
  },
  {
    headerMode: "none"
  }
);

DiscoverStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;

  let routeName = navigation.state.routes[navigation.state.index].routeName;

  if (routeName == "Detail") {
    tabBarVisible = false;
  }

  return {
    tabBarVisible
  };
};

const AccountStack = createStackNavigator(
  {
    Account: Account
  },
  {
    headerMode: "none"
  }
);

const SearchStack = createStackNavigator(
  {
    Search: Search
  },
  {
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

const TransactionStack = createStackNavigator(
  {
    MyTransaction: MyTransaction,
    MyTransactionDetail: MyTransactionDetail,
    AddNewEquipment: AddNewEquipmentStack
  },
  {
    mode: "modal",
    headerMode: "none",
    initialRouteName: "MyTransaction"
  }
);

TransactionStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;

  let routeName = navigation.state.routes[navigation.state.index].routeName;

  if (routeName == "AddNewEquipment") {
    tabBarVisible = false;
  }

  return {
    tabBarVisible
  };
};

const ActivityStack = createStackNavigator(
  {
    Activity: Activity,
    Notification: Notification,
    Detail: ActivityDetail
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
    Call: {
      screen: () => null, // Empty screen
      navigationOptions: () => ({
        title: "",
        tabBarOnPress: () => null,
        tabBarIcon: <ButtonWithIcon /> // Plus button component
      })
    },
    Transaction: TransactionStack,
    Account: AccountStack
  },
  {
    initialRouteName: "Account",
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
        } else if (routeName === "Transaction") {
          icon = focused
            ? require("../../assets/icons/icons8-garage-active.png")
            : require("../../assets/icons/icons8-garage.png");
        } else if (routeName === "Account") {
          icon = focused
            ? require("../../assets/icons/icons8-settings-active.png")
            : require("../../assets/icons/icons8-settings.png");
        }

        return (
          <Image
            source={icon}
            style={{
              height: 29,
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

const AppNavigator = createSwitchNavigator({
  App: TabNavigator
});

const styles = StyleSheet.create({
  image: {
    width: 26,
    height: 26,
    marginTop: 2
  }
});

export default createAppContainer(AppNavigator);
