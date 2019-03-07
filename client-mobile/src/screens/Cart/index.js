import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList
} from "react-native";
import { SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import { Feather } from "@expo/vector-icons";
import { getCartList, removeItemCart } from "../../redux/actions/cart";

import Loading from "../../components/Loading";
import Header from "../../components/Header";
import fontSize from "../../config/fontSize";

@connect(
  state => ({
    cart: state.cart.list,
    loading: state.cart.loading
  }),
  dispatch => ({
    fetchGetCartList: contractorId => {
      dispatch(getCartList(contractorId));
    },
    fetchRemoveItemCart: (contractorId, cartId) => {
      dispatch(removeItemCart(contractorId, cartId));
    }
  })
)
class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.fetchGetCartList(12);
  }

  _handleRemoveItem = (contractorId, cartId) => {
    this.props.fetchRemoveItemCart(contractorId, cartId);
  };

  _renderItem = ({ item }) => {
    return (
      <View key={item.id}>
        <Text>{item.equipment.name}</Text>
        <Text>{item.equipment.address}</Text>
        <TouchableOpacity onPress={() => this._handleRemoveItem(12, item.id)}>
          <Feather name={"x"} size={24} />
        </TouchableOpacity>
      </View>
    );
  };

  _renderFlatList = () => {
    const { cart } = this.props;
    return (
      <View>
        <FlatList
          data={cart}
          renderItem={this._renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
        <TouchableOpacity>
          <Text>Check out</Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const { loading, navigation } = this.props;
    return (
      <SafeAreaView
        forceInset={{ bottom: "always", top: "always" }}
        style={styles.container}
      >
        <Header
          renderLeftButton={() => (
            <TouchableOpacity>
              <Feather
                name={"arrow-left"}
                size={24}
                onPress={() => navigation.goBack()}
              />
            </TouchableOpacity>
          )}
        >
          <Text>Cart</Text>
        </Header>
        {!loading ? this._renderFlatList() : <Loading />}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default Cart;
