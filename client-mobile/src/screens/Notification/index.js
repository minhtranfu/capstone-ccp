import React, { Component } from "react";
import { StyleSheet, Text, View, AsyncStorage, Button } from "react-native";
import { connect } from "react-redux";

import { isSignedIn } from "../../config/auth";
import RequireLogin from "../Login/RequireLogin";
import Loading from "../../components/Loading";
@connect(state => {
  console.log(state.auth);
  return {
    auth: state.auth.userIsLoggin
  };
})
class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signedIn: false,
      checkedSignIn: false
    };
  }

  render() {
    const { checkedSignIn, signedIn } = this.state;
    const { navigation, auth } = this.props;
    console.log("Notification", auth);

    if (auth) {
      return (
        <View style={styles.container}>
          <Text>Notification</Text>
        </View>
      );
    } else {
      return <RequireLogin navigation={navigation} />;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});

export default Notification;
