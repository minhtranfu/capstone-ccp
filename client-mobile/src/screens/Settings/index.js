import React, { Component } from "react";
import { StyleSheet, Text, View, Button, AsyncStorage } from "react-native";
import { connect } from "react-redux";

import { logOut } from "../../redux/actions/auth";
import { isSignedIn, onSignOut } from "../../config/auth";
import RequireLogin from "../Login/RequireLogin";
import Login from "../Login";
import Loading from "../../components/Loading";

@connect(
  state => {
    return {
      auth: state.auth.userIsLoggin
    };
  },
  dispatch => ({
    fetchLogout: () => {
      dispatch(logOut());
    }
  })
)
class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signedIn: false,
      checkedSignIn: false
    };
  }

  render() {
    const { checkedSignIn, signedIn } = this.state;
    const { auth } = this.props;
    if (auth) {
      return (
        <View style={styles.container} key={signedIn}>
          <Button
            title="Logout"
            onPress={() => {
              this.props.fetchLogout();
            }}
          />
        </View>
      );
    } else {
      return <Login navigation={this.props.navigation} />;
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
