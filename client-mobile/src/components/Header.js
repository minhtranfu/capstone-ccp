import React from "react";
import { SafeAreaView } from "react-navigation";
import { StatusBar, View, StyleSheet } from "react-native";

class Header extends React.PureComponent {
  render() {
    return <View style={styles.status}>{this.props.children}</View>;
  }
}

const styles = StyleSheet.create({
  status: {
    height: 44,
    flexDirection: "row",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center"
  }
});

export default Header;
