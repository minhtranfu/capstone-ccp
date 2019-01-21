import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { withNavigation } from "react-navigation";

class RequireLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.container}>
        <Text onPress={() => this.props.navigation.navigate("Settings")}>
          Please login
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default withNavigation(RequireLogin);
