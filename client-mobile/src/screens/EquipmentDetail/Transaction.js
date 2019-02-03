import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-navigation";
import { connect } from "react-redux";

import { updateEquipment } from "../../redux/actions/equipment";
import ParallaxList from "../../components/ParallaxList";
import Loading from "../../components/Loading";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

@connect(
  state => ({}),
  dispatch => ({
    fetchUpdateEquipment: (id, status) => {
      dispatch(updateEquipment(id, status));
    }
  })
)
class ConfirmTransaction extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleConfirmBooking = () => {
    const { id } = this.props.navigation.state.params;
    const status = "pending";
    this.props.fetchUpdateEquipment(id, status);
  };

  render() {
    const { equipment } = this.props.navigation.state.params;
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "always", top: "always" }}
      >
        {equipment ? (
          <View>
            <Text>{equipment.name}</Text>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate("Notification");
                this.handleConfirmBooking();
              }}
            >
              <Text>Confirm booking</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Loading />
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default ConfirmTransaction;
