import React from "react";
import { BottomTabBar } from "react-navigation";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  Image,
  Dimensions
} from "react-native";
import { LinearGradient } from "expo";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const Touchable =
  Platform.OS === "ios" ? TouchableOpacity : TouchableNativeFeedback;

const CustomTabBarBottom = props => {
  return (
    <View>
      <Touchable style={styles.actionButton}>
        <Image
          source={require("../../assets/icons/phone_ic.png")}
          style={styles.image}
          resizeMode={"contain"}
        />
      </Touchable>
      <View style={{ backgroundColor: "#fff" }}>
        <BottomTabBar {...props} />
      </View>
    </View>
  );
};

const styles = {
  actionButton: {
    backgroundColor: "#6200EE",
    width: 50,
    height: 50,
    borderRadius: 25,
    position: "absolute",
    bottom: 20,
    left: width / 2 - 25,
    zIndex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  image: {
    width: 30,
    height: 30
  }
};

export default CustomTabBarBottom;
