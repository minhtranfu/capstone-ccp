import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";

class ShowToast extends Component {
  static propTypes = {
    message: PropTypes.string
  };
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
      1000
    ); // show toast after 1s

    setTimeout(
      () =>
        this.setState({
          visible: false
        }),
      3000
    ); // hide toast after 3s
  }

  componentDidUpdate(prevProp) {
    if (prevProp.message !== this.props.message) {
      setTimeout(
        () =>
          this.setState({
            visible: true
          }),
        1000
      ); // show toast after 1s

      setTimeout(
        () =>
          this.setState({
            visible: false
          }),
        3000
      ); // hide toast after 3s
    }
  }

  render() {
    const { message } = this.props;
    console.log("notiMess", message);
    return (
      <Modal transparent={true} visible={this.state.visible}>
        <View style={{ marginTop: 22 }}>
          <View>
            <TouchableOpacity
              onPress={() => {
                this.setModalVisible(!this.state.modalVisible);
              }}
            >
              <Text>Hide Modal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 300,
    height: 200
  }
});

export default ShowToast;
