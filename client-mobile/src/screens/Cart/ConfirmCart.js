import React, { Component } from "react";
import { SafeAreaView } from "react-navigation";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ListView
} from "react-native";
import { connect } from "react-redux";
import { addItemToCart } from "../../redux/actions/cart";
import { autoCompleteSearch } from "../../redux/actions/location";
import { Feather } from "@expo/vector-icons";

import Header from "../../components/Header";
import Button from "../../components/Button";
import InputField from "../../components/InputField";

import fontSize from "../../config/fontSize";

@connect(
  state => ({
    user: state.auth.data
  }),
  dispatch => ({
    fetchAddItemToCart: (contractorId, cart) => {
      dispatch(addItemToCart(contractorId, cart));
    }
  })
)
class ConfirmCart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: "",
      location: {}
    };
  }

  _handleAddNewItemCart = () => {
    const { cart } = this.props.navigation.state.params;
    const { user } = this.props;
    const newCart = {
      ...cart,
      requesterAddress: this.state.address,
      requesterLong: 123.12,
      requesterLat: 10.123
    };
    this.props.fetchAddItemToCart(user.contractor.id, newCart);
    this.props.navigation.goBack();
  };

  _handleOnChangeText = async (field, address) => {
    this.setState({
      [field]: address,
      location: await autoCompleteSearch(address)
    });
    console.log(location);
  };

  render() {
    const { cart } = this.props.navigation.state.params;
    const { address } = this.state;
    return (
      <SafeAreaView
        forceInset={{ bottom: "never", top: "always" }}
        style={styles.container}
      >
        <Header
          renderLeftButton={() => (
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Feather name={"arrow-left"} size={24} />
            </TouchableOpacity>
          )}
        >
          <Text style={styles.header}>Cart</Text>
        </Header>
        <ScrollView style={{ paddingHorizontal: 15 }}>
          <Text style={styles.text}>{cart.beginDate}</Text>
          <Text style={styles.text}>{cart.endDate}</Text>
          <InputField
            label={"Requester address"}
            placeholder={"Input your address"}
            customWrapperStyle={{ marginBottom: 20 }}
            inputType="text"
            onChangeText={value => this._handleOnChangeText("address", value)}
            value={address}
          />
          <TouchableOpacity onPress={this._handleAddNewItemCart}>
            <Text style={styles.text}>Add</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    fontSize: fontSize.h4,
    fontWeight: "500"
  },
  text: {
    fontSize: fontSize.bodyText,
    fontWeight: "500"
  }
});

export default ConfirmCart;
