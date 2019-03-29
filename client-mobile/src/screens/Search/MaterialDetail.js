import React, { Component } from "react";
import { SafeAreaView } from "react-navigation";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert
} from "react-native";
import { Image } from "react-native-expo-image-cache";
import { connect } from "react-redux";
import { addMaterialItemToCart } from "../../redux/actions/cart";
import Feather from "@expo/vector-icons/Feather";

import Title from "../../components/Title";
import Button from "../../components/Button";
import Header from "../../components/Header";
import Loading from "../../components/Loading";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

const { width } = Dimensions.get("window");

@connect(
  (state, ownProps) => {
    const { id } = ownProps.navigation.state.params;
    return {
      detail: state.material.listSearch.find(item => item.id === id)
    };
  },
  dispatch => ({
    fetchAddItemToCart: item => {
      dispatch(addMaterialItemToCart(item));
    }
  })
)
class MaterialDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { detail } = this.props;
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "never", top: "always" }}
      >
        <Header
          renderLeftButton={() => (
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Feather name="chevron-left" size={24} />
            </TouchableOpacity>
          )}
        >
          <Text>Result</Text>
        </Header>
        {detail ? (
          <ScrollView contentContainerStyle={{ paddingHorizontal: 15 }}>
            <Image
              uri={detail.thumbnailImageUrl}
              resizeMode={"cover"}
              style={{ height: 200 }}
            />
            <Title title={"Material information"} />
            <Text style={styles.text}>{detail.name}</Text>
            <Text style={styles.text}>{detail.manufacturer}</Text>
            <Text style={styles.text}>{detail.contractor.name}</Text>
            <Text style={styles.text}>{detail.contractor.email}</Text>
            <Title title={"Price"} />
            <Text style={styles.text}>{detail.price}</Text>
            <Title title={"Description"} />
            <Text style={styles.description}>{detail.description}</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                flex: 1
              }}
            >
              <Button
                text={"Book"}
                onPress={() =>
                  this.props.navigation.navigate("ConfirmMaterial", {
                    material: detail
                  })
                }
                wrapperStyle={{ width: 200 }}
              />
              <Button
                text={"Add to cart"}
                onPress={() => this.props.fetchAddItemToCart(detail)}
                wrapperStyle={{ width: 200 }}
              />
            </View>
          </ScrollView>
        ) : (
          <Loading />
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  text: {
    color: colors.text,
    fontSize: fontSize.bodyText,
    fontWeight: "500"
  },
  description: {
    color: colors.text50,
    fontSize: fontSize.bodyText,
    fontWeight: "600"
  }
});

export default MaterialDetail;
