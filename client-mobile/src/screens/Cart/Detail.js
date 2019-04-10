import React, { Component } from "react";
import { SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from "react-native";
import {
  clearMaterialCart,
  listMaterialCartItem,
  updateMaterialItemToCart
} from "../../redux/actions/cart";
import { requestMaterialTransaction } from "../../redux/actions/transaction";
import { bindActionCreators } from "redux";
import Feather from "@expo/vector-icons/Feather";

import Button from "../../components/Button";
import InputField from "../../components/InputField";
import Header from "../../components/Header";
import Title from "../../components/Title";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

@connect(
  (state, ownProps) => {
    const { id } = ownProps.navigation.state.params;
    return {
      cart: state.cart.list,
      materialDetail: state.cart.listMaterial.find(item => item.id === id),
      loading: state.cart.loading,
      user: state.auth.data
    };
  },
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
class MaterialCartDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      quantity: null
    };
  }

  componentDidMount() {
    this.props.fetchListMaterialCart();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    //Check data is update
    if (
      Object.keys(prevState.data).length === 0 &&
      nextProps.materialDetail !== prevState.data
    ) {
      return {
        data: nextProps.materialDetail
      };
    }
  }

  _handleInputChanged = (id, value) => {
    const { data } = this.state;
    this.setState({
      data: {
        ...data,
        items: data.items.map(item =>
          item.id === id ? { ...item, quantity: parseInt(value) } : item
        )
      }
    });
  };

  _handleUpdateItemQuantity = itemId => {
    const { data } = this.state;
    const { id } = this.props.navigation.state.params;
    const item = data.items.find(item => item.id === itemId);
    this.props.fetchUpdateMaterialItem(id, itemId, item.quantity);
  };

  _handlePlaceOrder = () => {
    const { data } = this.state;
    const order = {
      requesterAddress: "Phú Nhuận",
      requesterLat: 10.34,
      requesterLong: 106,
      supplier: {
        id: data.id
      },
      materialTransactionDetails: data.items.map(item => {
        return {
          quantity: item.quantity,
          material: {
            id: item.id
          }
        };
      })
    };
    this.props.fetchSendMaterialRequest(order);
  };

  _renderScrollViewContent = () => {
    const { data } = this.state;
    return (
      <View>
        {data.items.map(order => (
          <View key={order.id}>
            <Text style={styles.text}>{order.name}</Text>
            <Text style={styles.text}>{order.price}</Text>
            <InputField
              label={"Quantity"}
              placeholder={"Input your equipment name"}
              customWrapperStyle={{ marginBottom: 20 }}
              inputType="text"
              onBlur={() => this._handleUpdateItemQuantity(order.id)}
              onChangeText={value => this._handleInputChanged(order.id, value)}
              value={order.quantity.toString()}
              keyboardType={"numeric"}
              returnKeyType={"next"}
            />
            <Text style={styles.text}>
              Total price: {order.price * order.quantity}VND
            </Text>
          </View>
        ))}
      </View>
    );
  };

  render() {
    const { materialDetail } = this.props;
    console.log(materialDetail);
    return (
      <SafeAreaView style={styles.container} forceInset={{ top: "always" }}>
        <Header
          renderLeftButton={() => (
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Feather name={"chevron-left"} size={24} />
            </TouchableOpacity>
          )}
        >
          <Text style={styles.title}>Order detail</Text>
        </Header>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 15 }}>
          {this._renderScrollViewContent()}
        </ScrollView>
        <SafeAreaView forceInset={{ bottom: "always" }}>
          <Button text={"Place order"} onPress={this._handlePlaceOrder} />
          <Button text={"Delete order"} />
        </SafeAreaView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  title: {
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

export default MaterialCartDetail;
