import React from "react";
import { SafeAreaView } from "react-navigation";
import PropTypes from "prop-types";
import { StatusBar, View, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

class Header extends React.PureComponent {
  render() {
    const {
      containerStyle,
      onPress,
      renderLeftButton,
      renderRightButton,
      title,
      caption,
      headerStyle
    } = this.props;

    return (
      <View style={[styles.container, containerStyle]}>
        <View style={{ flex: 1, alignItems: "flex-start", marginLeft: 15 }}>
          {renderLeftButton ? renderLeftButton() : null}
        </View>
        <View
          style={[
            styles.header,
            renderLeftButton ? { marginLeft: 5 } : null,
            renderRightButton ? { marginRight: 5 } : null
          ]}
        >
          {this.props.children}
        </View>
        <View style={{ flex: 1, alignItems: "flex-end", marginRight: 15 }}>
          {renderRightButton ? renderRightButton() : null}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  header: {
    flex: 3,
    alignItems: "center",
    justifyContent: "center"
  }
});

export default Header;
