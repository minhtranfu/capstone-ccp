import React from "react";
import { SafeAreaView } from "react-navigation";
import { StatusBar, View, Animated, StyleSheet } from "react-native";

class Header extends React.PureComponent {
  render() {
    const { background } = this.props;
    return (
      <Animated.View style={[styles.status, this.props.style]}>
        {this.props.children}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  status: {
    borderBottomWidth: 0,
    height: 44,
    flexDirection: "row",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
    position: "absolute"
  }
});

export default Header;
