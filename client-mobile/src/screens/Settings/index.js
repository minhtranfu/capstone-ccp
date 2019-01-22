import React, { Component } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { isSignedIn, onSignIn } from "../../config/auth";
import RequireLogin from "../Login/RequireLogin";
import Login from "../Login";
import Loading from "../../components/Loading";

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signedIn: false,
      checkedSignIn: false
    };
  }

  componentDidMount() {
    isSignedIn()
      .then(res => this.setState({ signedIn: res, checkedSignIn: true }))
      .catch(err => alert("An error occurred"));
  }
  render() {
    const { checkedSignIn, signedIn } = this.state;
    console.log(signedIn);
    if (!checkedSignIn) {
      return <Loading />;
    }
    if (signedIn) {
      return <Login />;
    } else {
      return (
        <View style={styles.container}>
          <Button
            title="Login"
            onPress={() => {
              onSignIn, this.props.navigation.navigate("Discover");
            }}
          />
        </View>
      );
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

export default Settings;
