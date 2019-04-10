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
  clearMaterialCart,
  listMaterialCartItem,
  updateMaterialItemToCart
} from "../../redux/actions/cart";
import { requestMaterialTransaction } from "../../redux/actions/transaction";
import Swipeable from "react-native-swipeable";
import { bindActionCreators } from "redux";

import InputField from "../../components/InputField";
import Button from "../../components/Button";
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
  dispatch =>
    bindActionCreators(
      {
        fetchClearMaterial: clearMaterialCart,
        fetchListMaterialCart: listMaterialCartItem,
        fetchSendMaterialRequest: requestMaterialTransaction,
        fetchUpdateMaterialItem: updateMaterialItemToCart
      },
      dispatch
    )
)
class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cart: {}
    };
  }

  componentDidMount() {
    //this.props.fetchGetCartList(12);
    this.props.fetchListMaterialCart();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    //Check data is update
    if (
      Object.keys(prevState.cart).length === 0 &&
      nextProps.materialCart !== prevState.cart
    ) {
      return {
        cart: nextProps.materialCart
      };
    }
  }

  _handleQuantityChanged = (supplierId, id, value) => {
    const { cart } = this.state;
    this.setState({
      cart: cart.map(supplier =>
        supplier.id === supplierId
          ? {
              ...supplier,
              items: supplier.items.map(item =>
                item.id === id ? { ...item, quantity: parseInt(value) } : item
              )
            }
          : supplier
      )
    });
  };

  _handleUpdateItemQuantity = (supplierId, itemId) => {
    const { cart } = this.state;
    const supplier = cart.find(item => item.id === supplierId);
    const item = supplier.items.find(item => item.id === itemId);
    this.props.fetchUpdateMaterialItem(supplierId, itemId, item.quantity);
  };

  _renderScrollViewContent = () => {
    const { materialCart } = this.props;
    const { cart } = this.state;
    console.log(cart);
    return (
      <View>
        <Title title={"Material"} />
        {cart.map(supplierItems => (
          <View key={supplierItems.id}>
            <Text>Supplier: {supplierItems.items[0].contractor.name}</Text>
            <Text>Total items: {supplierItems.items.length}</Text>
            {supplierItems.items.map(item => (
              <View key={item.id}>
                <Text style={styles.text}>{item.name}</Text>
                <Text style={styles.text}>{item.price}</Text>
                <InputField
                  label={"Quantity"}
                  placeholder={"Input your quantity"}
                  customWrapperStyle={{ marginBottom: 20 }}
                  inputType="text"
                  onBlur={() =>
                    this._handleUpdateItemQuantity(item.contractor.id, item.id)
                  }
                  onChangeText={value =>
                    this._handleQuantityChanged(
                      item.contractor.id,
                      item.id,
                      value
                    )
                  }
                  value={item.quantity.toString()}
                  keyboardType={"numeric"}
                  returnKeyType={"next"}
                />
                <Text style={styles.text}>
                  Total price: {item.price * item.quantity}VND
                </Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  };

  render() {
    const { loading, navigation, materialCart } = this.props;
    const { cart } = this.state;
    console.log(materialCart);
    return (
      <SafeAreaView forceInset={{ top: "always" }} style={styles.container}>
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
        <SafeAreaView forceInset={{ bottom: "always" }}>
          <Button
            text={"Place order"}
            onPress={() =>
              this.props.navigation.navigate("ConfirmCart", { cart })
            }
          />
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
    fontWeight: "500"
  },
  text: {
    fontSize: fontSize.bodyText,
    fontWeight: "500"
  }
});

export default Cart;
