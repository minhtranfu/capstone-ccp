import React, { Component } from "react";
import { SafeAreaView } from "react-navigation";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  Animated
} from "react-native";
import { Image } from "react-native-expo-image-cache";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { addMaterialItemToCart } from "../../redux/actions/cart";
import Feather from "@expo/vector-icons/Feather";

import ParallaxList from "../../components/ParallaxList";
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
  dispatch =>
    bindActionCreators({ fetchAddItemToCart: addMaterialItemToCart }, dispatch)
)
class MaterialDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  _renderScrollItem = () => {
    const { detail } = this.props;
    return (
      <View
        style={{
          flex: 1,
          paddingHorizontal: 15,
          backgroundColor: "white",
          paddingTop: 15
        }}
      >
        <Title title={"Material information"} />
        <View style={{ flexDirection: "column", justifyContent: "center" }}>
          <Text style={styles.text}>{detail.name}</Text>
          <Text style={styles.text}>{detail.manufacturer}</Text>
          <Text style={styles.text}>{detail.contractor.name}</Text>
          <Text style={styles.text}>{detail.contractor.email}</Text>
        </View>
        <Title title={"Price"} />
        <Text style={styles.text}>{detail.price}</Text>
        <Title title={"Description"} />
        <Text style={styles.description}>{detail.description}</Text>
      </View>
    );
  };

  render() {
    const { detail } = this.props;
    return (
      <SafeAreaView style={styles.container} forceInset={{ top: "always" }}>
        <ParallaxList
          title={detail.name}
          removeTitle={true}
          hasThumbnail={true}
          imageURL={
            detail.thumbnailImageUrl ? detail.thumbnailImageUrl : "null"
          }
          hasLeft={true}
          hasCart={true}
          scrollElement={<Animated.ScrollView />}
          renderScrollItem={this._renderScrollItem}
        />
        <SafeAreaView
          style={styles.bottomWrapper}
          forceInset={{ bottom: "always" }}
        >
          <Button
            text={"Book"}
            onPress={() =>
              this.props.navigation.navigate("ConfirmMaterial", {
                material: detail
              })
            }
            wrapperStyle={{ flex: 1 }}
            buttonStyle={{ borderRadius: 0 }}
          />
          <Button
            text={"Add to cart"}
            onPress={() =>
              this.props.fetchAddItemToCart(detail.contractor.id, detail)
            }
            wrapperStyle={{ flex: 1 }}
            buttonStyle={{ borderRadius: 0 }}
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
  text: {
    color: colors.text,
    fontSize: fontSize.bodyText,
    fontWeight: "500"
  },
  description: {
    color: colors.text50,
    fontSize: fontSize.bodyText,
    fontWeight: "600"
  },
  bottomWrapper: {
    flexDirection: "row",
    alignItems: "center"
  }
});

export default MaterialDetail;
