import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert
} from "react-native";
import { SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import { Feather } from "@expo/vector-icons";
import { Image } from "react-native-expo-image-cache";
import {
  getCartList,
  removeItemCart,
  cartCheckout
} from "../../redux/actions/cart";
import Swipeable from "react-native-swipeable";

import TransactionItem from "../../components/TransactionItem";
import Loading from "../../components/Loading";
import Header from "../../components/Header";

import fontSize from "../../config/fontSize";
import colors from "../../config/colors";

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
      <TransactionItem
        id={item.id}
        name={item.equipment.name}
        imageURL={
          item.equipment.thumbnailImage ||
          "https://images1.houstonpress.com/imager/u/745xauto/9832653/dump_edit_resize.jpg"
        }
        contractor={item.equipment.contractor.name}
        phone={item.equipment.contractor.phoneNumber}
        beginDate={item.beginDate}
        endDate={item.endDate}
        avatarURL={item.equipment.contractor.thumbnailImage}
        price={item.equipment.dailyPrice}
        containerStyle={{
          backgroundColor: "white",
          borderRadius: 10,
          padding: 10
        }}
      />
    );
  };

  _handleCheckOut = () => {
    const { user } = this.props;
    this.props.fetchCheckOut(user.contractor.id);
  };

  _renderFlatList = () => {
    const { cart } = this.props;
    console.log(cart);
    return (
      <View style={{ flex: 1 }}>
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
          <Text style={styles.header}>My Orders</Text>
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
