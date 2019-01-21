/* eslint-disable react/no-multi-comp */
import React from "react";
import { SafeAreaView } from "react-navigation";
import { StatusBar, View, Animated, StyleSheet } from "react-native";

class Header extends React.PureComponent {
  render() {
    const { background } = this.props;
    return (
      <Animated.View
        style={[
          {
            flex: 1,
            borderBottomWidth: 0,
            height: 44,
            flexDirection: "row",
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: "transparent",
            position: "absolute"
          },
          this.props.style
        ]}
      >
        {this.props.children}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  status: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: "transparent",
    height: 44
  }
});

export default Header;
