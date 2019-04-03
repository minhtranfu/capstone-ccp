import React, { Component } from "react";
import { Image } from "react-native-expo-image-cache";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { requestMaterialTransaction } from "../../../redux/actions/transaction";

import fontSize from "../../../config/fontSize";
import colors from "../../../config/colors";

@connect(
  state => ({}),
  dispatch => ({
    fetchSendMaterialRequest: material => {
      dispatch(requestMaterialTransaction(material));
    }
  })
)
class MaterialItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  _handlePlaceOrder = () => {
    const { id, items, onPressOrder } = this.props;
    const materialTransactionDetails = items.map(item => {
      return {
        material: { id: item.id },
        quantity: parseInt(item.quantity)
      };
    });
    const material = {
      requesterAddress: "Phú Nhuận",
      requesterLat: 10.34,
      requesterLong: 106,
      supplier: {
        id: id
      },
      materialTransactionDetails
    };
    console.log(material);
    this.props.fetchSendMaterialRequest(material);
  };

  render() {
    const { items, onPress, onPressOrder } = this.props;
    console.log(
      items.map(item => {
        return {
          material: { id: item.id },
          quantity: item.quantity
        };
      })
    );
    return (
      <TouchableOpacity style={styles.container} onPress={onPress}>
        {/* <View style={styles.imageWrapper}>
          {items.length > 4 ? (
            items.map(item => (
              <Image
                uri={item.thumbnailImageUrl}
                resizeMode={"cover"}
                style={{ width: 25, height: 25 }}
              />
            ))
          ) : (
            null
          )}
        </View> */}
        <Image
          uri={items[0].thumbnailImageUrl}
          resizeMode={"cover"}
          style={{ width: 100, height: 100 }}
        />
        <View style={{ backgroundColor: "white", padding: 10, flex: 2 }}>
          {items.length > 4 ? (
            <Text
              style={{ fontSize: fontSize.secondaryText, color: colors.text }}
            >
              {items[0].name} and {items.length} more materials
            </Text>
          ) : (
            <Text
              style={{ fontSize: fontSize.secondaryText, color: colors.text }}
            >
              {items[0].name}
            </Text>
          )}
          <Text style={{ fontSize: fontSize.caption, color: colors.text50 }}>
            Supplier: {items[0].contractor.name}
          </Text>
          <Text style={{ fontSize: fontSize.caption, color: colors.text50 }}>
            Total cart items: {items.length}
          </Text>
          <TouchableOpacity
            onPress={this._handlePlaceOrder}
            style={{
              alignSelf: "flex-end",
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 5,
              height: 30,
              width: 100,
              borderRadius: 5,
              borderWidth: StyleSheet.hairlineWidth,
              backgroundColor: colors.text
            }}
          >
            <Text style={{ fontSize: fontSize.secondaryText, color: "white" }}>
              Place order
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    ...colors.shadow
  },
  imageWrapper: {
    flex: 1,
    flexWrap: "wrap"
  }
});

export default MaterialItem;
