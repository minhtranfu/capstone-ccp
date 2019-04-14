import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Text, Alert } from "react-native";

connect(state => ({
  status: state.status
}));
class ShowAlert extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    _showAlert = msg => {
      Alert.alert("Error", msg, [{ text: "OK" }], {
        cancelable: true
      });
    };
    return (
      <View>
        {this.props.status ? this._showAlert(this.props.status.message) : null}
      </View>
    );
  }
}

export default ShowAlert;
