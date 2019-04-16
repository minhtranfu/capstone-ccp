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

import Contractor from "./components/Contractor";
import Item from "./components/Item";
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
                item.id === id ? { ...item, quantity: value } : item
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

  _renderEmptyView = () => {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={styles.header}>There is no items</Text>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("MaterialSearch")}
        >
          <Text style={styles.text}>Search material</Text>
        </TouchableOpacity>
      </View>
    );
  };

  _renderScrollViewContent = () => {
    const { materialCart } = this.props;
    const { cart } = this.state;
    console.log(cart);
    return (
      <View>
        {cart.map(supplierItems => (
          <View key={supplierItems.id}>
            <Title title={"Supplier"} />
            <Contractor
              name={supplierItems.items[0].contractor.name}
              rating={supplierItems.items[0].contractor.averageMaterialRating}
              phone={supplierItems.items[0].contractor.phoneNumber}
              imageUrl={supplierItems.items[0].contractor.thumbnailImageUrl}
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <Title title="Total items" />
              <View style={styles.status}>
                <Text
                  style={{ fontSize: fontSize.secondaryText, color: "white" }}
                >
                  {supplierItems.items.length}
                </Text>
              </View>
            </View>
            {supplierItems.items.map(item => (
              <Item
                key={item.id}
                name={item.name}
                manufacturer={item.manufacturer}
                price={item.price}
                imageUrl={item.thumbnailImageUrl}
                quantity={item.quantity}
              />
              // <View key={item.id} >
              //   <Text style={styles.text}>{item.name}</Text>
              //   <Text style={styles.text}>{item.price}</Text>
              //   <InputField
              //     label={"Quantity"}
              //     placeholder={"Input your quantity"}
              //     customWrapperStyle={{ marginBottom: 20 }}
              //     inputType="text"
              //     onBlur={() =>
              //       this._handleUpdateItemQuantity(item.contractor.id, item.id)
              //     }
              //     onChangeText={value =>
              //       this._handleQuantityChanged(
              //         item.contractor.id,
              //         item.id,
              //         value
              //       )
              //     }
              //     value={item.quantity.toString()}
              //     keyboardType={"numeric"}
              //     returnKeyType={"next"}
              //   />
              //   <Text style={styles.text}>
              //     Total price: {item.price * item.quantity}VND
              //   </Text>
              // </View>
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
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather name={"arrow-left"} size={24} />
            </TouchableOpacity>
          )}
          renderRightButton={() => (
            <TouchableOpacity onPress={() => this.props.fetchClearMaterial()}>
              <Text style={styles.text}>Clear cart</Text>
            </TouchableOpacity>
          )}
        >
          <Text style={styles.header}>My Orders</Text>
        </Header>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 15 }}>
          {materialCart.length > 0
            ? this._renderScrollViewContent()
            : this._renderEmptyView()}
        </ScrollView>
        <SafeAreaView
          forceInset={{ bottom: "always" }}
          style={{
            backgroundColor:
              materialCart.length > 0 ? colors.secondaryColor : "#a5acb8"
          }}
        >
          <Button
            text={"Place order"}
            disabled={materialCart.length > 0 ? false : true}
            onPress={() =>
              this.props.navigation.navigate("ConfirmCart", { cart })
            }
            buttonStyle={{ backgroundColor: "transparent" }}
            bordered={false}
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
  status: {
    width: 30,
    borderRadius: 10,
    height: 20,
    backgroundColor: colors.status.ACCEPTED,
    alignItems: "center",
    justifyContent: "center"
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
  }
});

export default Cart;
