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
import Settings from "../screens/Settings";
import Search from "../screens/Search";
import SearchResult from "../screens/Search/SearchResult";
import Profile from "../screens/Profile";
import Equipment from "../screens/Equipment";
import MyEquipment from "../screens/MyEquipment";
import AddDetail from "../screens/MyEquipment/AddEquipment/AddDetail";
import AddDuration from "../screens/MyEquipment/AddEquipment/AddDuration";
import AddDurationText from "../screens/MyEquipment/AddEquipment/AddDurationText";
import AddImage from "../screens/MyEquipment/AddEquipment/AddImage";
import EquipmentDetail from "../screens/EquipmentDetail";
import Transaction from "../screens/EquipmentDetail/Transaction";
import MyEquipmentDetail from "../screens/MyEquipment/Detail";
import Activity from "../screens/Activity";
import Notification from "../screens/Activity/Notification";
import Login from "../screens/Login";
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

const SettingStack = createStackNavigator(
  {
    Settings: Settings
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

const EquipmentStack = createStackNavigator(
  {
    Equipment: MyEquipment,
    MyEquipmentDetail: MyEquipmentDetail,
    AddNewEquipment: AddNewEquipmentStack
  },
  {
    mode: "modal",
    headerMode: "none",
    initialRouteName: "Equipment"
  }
);

EquipmentStack.navigationOptions = ({ navigation }) => {
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
    Notification: Notification
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
    Equipment: EquipmentStack,
    Settings: SettingStack
  },
  {
    initialRouteName: "Equipment",
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        let icon;
        if (routeName === "Discover") {
          icon = focused
            ? require("../../assets/icons/discover_ic_active.png")
            : require("../../assets/icons/discover_ic.png");
        } else if (routeName === "Activity") {
          icon = focused
            ? require("../../assets/icons/search_ic_active.png")
            : require("../../assets/icons/search_ic.png");
        } else if (routeName === "Equipment") {
          icon = focused
            ? require("../../assets/icons/plus_ic_active.png")
            : require("../../assets/icons/plus_ic.png");
        } else if (routeName === "Settings") {
          icon = focused
            ? require("../../assets/icons/profile_ic_active.png")
            : require("../../assets/icons/profile_ic.png");
        }

        return (
          <Image
            source={icon}
            style={{
              width: 26,
              height: 26,
              marginTop: 2
            }}
            resizeMode={"contain"}
          />
        );
      }
    }),
    tabBarOptions: {
      activeTintColor: colors.primaryColor,
      inactiveTintColor: colors.secondaryColor,
      style: {
        backgroundColor: colors.white,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 0.5,
        borderTopWidth: 0
      }
    }
  }
);

// const TabNavigator = createBottomTabNavigator({
//   Discover: {
//     screen: DiscoverStack,
//     navigationOptions: {
//       title: "Discover",
//       tabBarIcon: ({ focused }) =>
//         focused ? (
//           <Image
//             source={require("../../assets/icons/discover_ic_active.png")}
//             style={styles.image}
//             resizeMode={"contain"}
//           />
//         ) : (
//           <Image
//             source={require("../../assets/icons/discover_ic.png")}
//             style={styles.image}
//             resizeMode={"contain"}
//           />
//         )
//     }
//   },
//   Notification: {
//     screen: NotificationStack,
//     navigationOptions: {
//       title: "Notification",
//       tabBarIcon: ({ focused }) =>
//         focused ? (
//           <Image
//             source={require("../../assets/icons/search_ic_active.png")}
//             style={styles.image}
//             resizeMode={"contain"}
//           />
//         ) : (
//           <Image
//             source={require("../../assets/icons/search_ic.png")}
//             style={styles.image}
//             resizeMode={"contain"}
//           />
//         )
//     }
//   },
//   Call: {
//     screen: () => null, // Empty screen
//     navigationOptions: () => ({
//       title: "",
//       tabBarIcon: <ButtonWithIcon /> // Plus button component
//     })
//   },
//   Equipment: {
//     screen: EquipmentStack,
//     navigationOptions: {
//       title: "Equipment",
//       tabBarIcon: ({ focused }) =>
//         focused ? (
//           <Image
//             source={require("../../assets/icons/plus_ic_active.png")}
//             style={styles.image}
//             resizeMode={"contain"}
//           />
//         ) : (
//           <Image
//             source={require("../../assets/icons/plus_ic.png")}
//             style={styles.image}
//             resizeMode={"contain"}
//           />
//         )
//     }
//   },
//   Settings: {
//     screen: SettingStack,
//     navigationOptions: {
//       title: "Profile",
//       tabBarIcon: ({ focused }) =>
//         focused ? (
//           <Image
//             source={require("../../assets/icons/profile_ic_active.png")}
//             style={styles.image}
//             resizeMode={"contain"}
//           />
//         ) : (
//           <Image
//             source={require("../../assets/icons/profile_ic.png")}
//             style={styles.image}
//             resizeMode={"contain"}
//           />
//         )
//     }
//   }
// });

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
