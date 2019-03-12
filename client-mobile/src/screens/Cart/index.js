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
import {
  getCartList,
  removeItemCart,
  cartCheckout
} from "../../redux/actions/cart";

import Loading from "../../components/Loading";
import Header from "../../components/Header";
import fontSize from "../../config/fontSize";

@connect(
  state => ({
    cart: state.cart.list,
    loading: state.cart.loading,
    user: state.auth.data
  }),
  dispatch => ({
    fetchGetCartList: contractorId => {
      dispatch(getCartList(contractorId));
    },
    fetchRemoveItemCart: (contractorId, cartId) => {
      dispatch(removeItemCart(contractorId, cartId));
    },
    fetchCheckOut: contractorId => {
      dispatch(cartCheckout(contractorId));
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
    const { user } = this.props;
    return (
      <View
        key={item.id}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <Text style={styles.text}>{item.equipment.name}</Text>
        <Text style={styles.text}>{item.equipment.address}</Text>
        <TouchableOpacity
          onPress={() => this._handleRemoveItem(user.contractor.id, item.id)}
        >
          <Feather name={"x"} size={24} />
        </TouchableOpacity>
      </View>
    );
  };

  _handleCheckOut = () => {
    const { user } = this.props;
    this.props.fetchCheckOut(user.contractor.id);
  };

  _renderFlatList = () => {
    const { cart } = this.props;
    return (
      <View>
        <FlatList
          style={{ paddingHorizontal: 15 }}
          data={cart}
          renderItem={this._renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
        <TouchableOpacity
          style={{ paddingHorizontal: 15 }}
          onPress={this._handleCheckOut}
        >
          <Text style={styles.text}>Check out</Text>
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
          <Text style={styles.header}>Cart</Text>
        </Header>
        {!loading ? this._renderFlatList() : <Loading />}
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

export default Cart;
