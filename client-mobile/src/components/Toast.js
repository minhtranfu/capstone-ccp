import Toast from "react-native-root-toast";
import React, { Component } from "react";
import { View, Text } from "react-native";

class ShowToast extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  componentDidMount() {
    setTimeout(
      () =>
        this.setState({
          visible: true
        }),
      2000
    ); // show toast after 2s

    setTimeout(
      () =>
        this.setState({
          visible: false
        }),
      4000
    ); // hide toast after 5s
  }

  render() {
    return (
      <Toast
        visible={this.state.visible}
        position={20}
        shadow={false}
        animation={true}
        hideOnPress={true}
      >
        {this.props.message}
      </Toast>
    );
  }
}

export default ShowToast;
