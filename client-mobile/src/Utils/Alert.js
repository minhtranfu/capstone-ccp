import React, { Component } from "react";
import { View, Text, Alert, StyleSheet } from "react-native";
import { SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import ShowToast from "../components/Toast";

@connect(state => ({
  status: state.status
}))
class ShowAlert extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidUpdate(prevProps, prevState) {
    const { listEquipment, status, navigation, token } = this.props;
    if (status.type === "error" && status.time !== prevProps.status.time) {
      console.log("Equipment renderrr");
      this._showAlert("Error", status.message);
    }

    if (status.type === "success" && status.time !== prevProps.status.time) {
      this._showAlert("Success", status.message);
    }
  }

  _showAlert = (title, msg) => {
    Alert.alert(title, msg, [{ text: "OK" }], {
      cancelable: true
    });
  };

  render() {
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ top: "always", bottom: "always" }}
      >
        {/* {this._showAlert()} */}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});

export default ShowAlert;
