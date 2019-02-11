import React from "react";
import { StyleSheet, TouchableOpacity, View, Image } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { withNavigation, NavigationActions } from "react-navigation";
import { connect } from "react-redux";

import colors from "../../config/colors";

const styles = StyleSheet.create({
  menu: {
    marginLeft: -5,
    color: "#FFF"
  },
  back: {
    color: "#FFF"
  },
  search: {
    color: "#FFF"
  },
  star: {
    color: "#FFF",
    marginLeft: 0
  },
  starSelected: {
    color: "#EDD349",
    marginLeft: 0
  },
  options: {
    color: "#FFF",
    marginLeft: 0,
    marginRight: 0
  },
  container: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center"
  }
});

const Favorite = () => (
  <TouchableOpacity>
    <Image
      source={require("../../../assets/icons/favorite_ic.png")}
      style={{ width: 26, height: 26 }}
    />
  </TouchableOpacity>
);

const backAction = NavigationActions.back({
  key: "Equipment"
});

const Close = ({ navigation }) => (
  <TouchableOpacity
    onPress={() => {
      navigation.goBack();
    }}
  >
    <Image
      source={require("../../../assets/icons/favorite_ic.png")}
      style={{ width: 26, height: 26 }}
    />
  </TouchableOpacity>
);

const Back = ({ onPress, navigation }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.goBack();
      }}
    >
      <Image
        source={require("../../../assets/icons/back-ic.png")}
        style={{ width: 22, height: 16 }}
      />
    </TouchableOpacity>
  );
};

const Profile = () => (
  <TouchableOpacity>
    <Image
      source={require("../../../assets/icons/profile_ic.png")}
      style={{ width: 24, height: 24 }}
    />
  </TouchableOpacity>
);

const Add = ({ onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Image
      source={require("../../../assets/icons/plus_ic.png")}
      style={{ width: 26, height: 26 }}
    />
  </TouchableOpacity>
);

const Search = ({ onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Feather name={"search"} size={24} />
  </TouchableOpacity>
);

export default {
  Back,
  Favorite,
  Profile,
  Add,
  Search,
  Close
};
