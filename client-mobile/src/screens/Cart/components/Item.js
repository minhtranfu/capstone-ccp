import React, { PureComponent } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput
} from "react-native";
import { Image } from "react-native-expo-image-cache";
import PropTypes from "prop-types";
import Feather from "@expo/vector-icons/Feather";

import colors from "../../../config/colors";
import fontSize from "../../../config/fontSize";

class Item extends PureComponent {
  static propTypes = {
    name: PropTypes.string,
    manufacturer: PropTypes.string,
    price: PropTypes.number,
    imageUrl: PropTypes.string,
    quantity: PropTypes.number
  };

  _capitializeLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  render() {
    const { name, manufacturer, price, imageUrl, quantity } = this.props;
    const totalPrice = quantity * price;
    return (
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "white",
            padding: 15
          }}
        >
          <Image
            uri={imageUrl}
            resizeMode={"cover"}
            style={{ width: 80, height: 80, borderRadius: 5 }}
          />
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-end"
            }}
          >
            <TouchableOpacity>
              <Feather name="x" size={20} />
            </TouchableOpacity>
            <Text style={styles.title}>{this._capitializeLetter(name)}</Text>
            <Text style={styles.text}>
              {this._capitializeLetter(manufacturer)}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity>
                <Feather name="minus" size={20} />
              </TouchableOpacity>
              <TextInput
                placeholder={"Input your quantity"}
                keyboardType={"numeric"}
                value={quantity.toString()}
              />
              <TouchableOpacity>
                <Feather name="plus" size={20} />
              </TouchableOpacity>
            </View>
            <Text style={styles.price}>{totalPrice}K/ VND</Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...colors.shadow,
    marginBottom: 15
  },
  title: {
    color: colors.text,
    fontSize: fontSize.bodyText,
    fontWeight: "600",
    marginBottom: 5
  },
  text: {
    color: colors.text,
    fontSize: fontSize.secondaryText,
    marginBottom: 5
  },
  price: {
    fontSize: fontSize.secondaryText,
    color: colors.text68,
    fontWeight: "500"
  }
});

export default Item;
