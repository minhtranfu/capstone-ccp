import React, { Component } from "react";
import { SafeAreaView } from "react-navigation";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ListView,
  Alert
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { autoCompleteSearch } from "../../redux/actions/location";
import { requestMaterialTransaction } from "../../redux/actions/transaction";
import { Feather } from "@expo/vector-icons";

import Loading from "../../components/Loading";
import AutoComplete from "../../components/AutoComplete";
import Header from "../../components/Header";
import Button from "../../components/Button";
import InputField from "../../components/InputField";

import fontSize from "../../config/fontSize";
import colors from "../../config/colors";

@connect(
  state => ({
    user: state.auth.data
  }),
  dispatch =>
    bindActionCreators(
      { fetchSendMaterialRequest: requestMaterialTransaction },
      dispatch
    )
)
class ConfirmCart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: "",
      lat: null,
      lng: null,
      hideResults: false,
      location: {}
    };
  }

  _showAlert = msg => {
    Alert.alert("Error", msg, [{ text: "OK" }], {
      cancelable: true
    });
  };

  _handleOnChangeText = async address => {
    this.setState({
      location: await autoCompleteSearch(address, null, null)
    });
  };

  _handlePlaceOrder = () => {
    const { cart } = this.props.navigation.state.params;
    const { address, lat, lng } = this.state;
    const orders = cart.map(supplier => {
      return {
        supplier: {
          id: supplier.id
        },
        materialTransactionDetails: supplier.items.map(item => {
          return {
            quantity: item.quantity,
            material: {
              id: item.id
            }
          };
        })
      };
    });
    if (!address) {
      this._showAlert("Please input your address");
    } else {
      console.log(orders);
      orders.map(item =>
        this.props.fetchSendMaterialRequest({
          ...item,
          requesterAddress: address,
          requesterLat: lat,
          requesterLong: lng
        })
      );
    }
  };

  _renderAutoCompleteItem = item => (
    <TouchableOpacity
      style={styles.autocompleteWrapper}
      onPress={() => {
        this.setState({
          address: item.main_text + ", " + item.secondary_text,
          lat: item.lat,
          lng: item.lng,
          hideResults: true
        });
      }}
    >
      <Text style={styles.text}>{item.main_text}</Text>
      <Text style={styles.caption}>{item.secondary_text}</Text>
    </TouchableOpacity>
  );

  render() {
    const { cart } = this.props.navigation.state.params;
    const { address, location, hideResults } = this.state;
    console.log(location);
    return (
      <SafeAreaView forceInset={{ top: "always" }} style={styles.container}>
        <Header
          renderLeftButton={() => (
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Feather name={"chevron-left"} size={24} />
            </TouchableOpacity>
          )}
        >
          <Text style={styles.header}>Cart Confirm</Text>
        </Header>
        <ScrollView style={{ paddingHorizontal: 15 }}>
          <AutoComplete
            label={"Address"}
            placeholder={"Input your address"}
            onFocus={() => this.setState({ hideResults: false })}
            hideResults={hideResults}
            // editable={
            //   !construction || construction === "Select your construction"
            // }
            data={location}
            value={address}
            onChangeText={value => {
              this.setState({ address: value });
              this._handleOnChangeText("address", value);
            }}
            renderItem={item => this._renderAutoCompleteItem(item)}
          />
        </ScrollView>
        <SafeAreaView forceInset={{ bottom: "always" }}>
          <Button text={"Order"} onPress={this._handlePlaceOrder} />
        </SafeAreaView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    fontSize: fontSize.bodyText,
    fontWeight: "500",
    color: colors.text
  },
  text: {
    fontSize: fontSize.secondaryText,
    fontWeight: "500",
    color: colors.text
  },
  caption: {
    fontSize: fontSize.caption,
    fontWeight: "500",
    color: colors.text50
  }
});

export default ConfirmCart;
