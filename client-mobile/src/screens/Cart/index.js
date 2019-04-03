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
  cartCheckout,
  clearMaterialCart,
  listMaterialCartItem
} from "../../redux/actions/cart";
import { requestMaterialTransaction } from "../../redux/actions/transaction";
import Swipeable from "react-native-swipeable";

import Title from "../../components/Title";
import MaterialItem from "./components/MaterialItem";
import TransactionItem from "../../components/TransactionItem";
import Loading from "../../components/Loading";
import Header from "../../components/Header";

import fontSize from "../../config/fontSize";
import colors from "../../config/colors";
import { ScrollView } from "react-native-gesture-handler";

@connect(
  state => ({
    cart: state.cart.list,
    materialCart: state.cart.listMaterial,
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
    },
    fetchClearMaterial: () => {
      dispatch(clearMaterialCart());
    },
    fetchListMaterialCart: () => {
      dispatch(listMaterialCartItem());
    },
    fetchSendMaterialRequest: material => {
      dispatch(requestMaterialTransaction(material));
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
    this.props.fetchListMaterialCart();
  }

  _handleRemoveItem = (contractorId, cartId) => {
    this.props.fetchRemoveItemCart(contractorId, cartId);
  };

  _renderItem = item => {
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

  _renderCartItem = item => {
    console.log(item);
    return (
      <View>
        <Text>{item.contractor.name}</Text>
        <Text>{item.manufacturer}</Text>
        <Text>{item.price}</Text>
        <Text>Input your quantity</Text>
      </View>
    );
  };

  _handleCheckOut = () => {
    const { user } = this.props;
    this.props.fetchCheckOut(user.contractor.id);
  };

  _renderFlatList = () => {
    const { cart, materialCart } = this.props;
    console.log(materialCart);
    return (
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 15 }}>
          <Text>Equipment</Text>
          {cart.map(item => this._renderItem(item))}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text>Material</Text>
            <TouchableOpacity onPress={() => this.props.fetchClearMaterial()}>
              <Text>Clear material</Text>
            </TouchableOpacity>
          </View>
          {materialCart.map(item => this._renderCartItem(item))}
        </ScrollView>
        <TouchableOpacity
          style={{ paddingHorizontal: 15 }}
          onPress={this._handleCheckOut}
        >
          <Text style={styles.text}>Check out</Text>
        </TouchableOpacity>
      </View>
    );
  };

  _renderScrollViewContent = () => {
    const { materialCart } = this.props;

    return (
      <View>
        <Title title={"Material"} />
        {materialCart.map(supplierItems => (
          <MaterialItem
            id={supplierItems.id}
            items={supplierItems.items}
            onPress={() =>
              this.props.navigation.navigate("MaterialCartDetail", {
                id: supplierItems.id
              })
            }
          />
        ))}
      </View>
    );
  };

  render() {
    const { loading, navigation, materialCart } = this.props;
    console.log(materialCart);
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
        <ScrollView contentContainerStyle={{ paddingHorizontal: 15 }}>
          {this._renderScrollViewContent()}
        </ScrollView>
        {/* {!loading ? this._renderFlatList() : <Loading />} */}
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
    fontWeight: "500"
  },
  text: {
    fontSize: fontSize.bodyText,
    fontWeight: "500"
  }
});

export default Cart;
