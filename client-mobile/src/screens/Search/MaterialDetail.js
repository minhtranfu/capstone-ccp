import React, { PureComponent } from "react";
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
import { Rating } from "react-native-ratings";

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
class MaterialDetail extends PureComponent {
  _capitalizeLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  _renderScrollItem = () => {
    const { detail } = this.props;
    console.log(detail);
    return (
      <View
        style={{
          flex: 1,
          paddingHorizontal: 15,
          backgroundColor: "white",
          paddingTop: 15
        }}
      >
        <View style={{ flexDirection: "column", justifyContent: "center" }}>
          <Text style={styles.title}>{detail.name}</Text>
          <Text style={styles.name}>{detail.manufacturer}</Text>
          <Text
            style={{
              marginBottom: 0,
              fontSize: fontSize.secondaryText,
              fontWeight: "600",
              color: colors.text50
            }}
          >
            Type: {this._capitalizeLetter(detail.materialType.name)}
          </Text>
          <Title title={"Supplier information"} />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 5
            }}
          >
            <Image
              uri={
                detail.contractor.thumbnailImageUrl
                  ? detail.contractor.thumbnailImageUrl
                  : "http://bootstraptema.ru/snippets/icons/2016/mia/2.png"
              }
              resizeMode={"cover"}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.name}>{detail.contractor.name}</Text>
              <Rating
                readonly={true}
                ratingCount={5}
                fractions={1}
                startingValue={detail.contractor.averageMaterialRating}
                imageSize={20}
                style={{
                  backgroundColor: "transparent",
                  alignItems: "flex-start"
                }}
              />
            </View>
          </View>
          <Text style={styles.text}>{detail.contractor.phoneNumber}</Text>
          <Text style={styles.text}>{detail.contractor.email}</Text>
          <Text style={[styles.text, { marginBottom: 0 }]}>
            Total reviews: {detail.contractor.materialFeedbacksCount}
          </Text>
        </View>
        <Title title={"Price"} />
        <Text style={styles.price}>{detail.price}K VND</Text>
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
            bordered={false}
          />
          <Button
            text={"Add to cart"}
            onPress={() =>
              this.props.fetchAddItemToCart(detail.contractor.id, detail)
            }
            buttonStyle={{ backgroundColor: colors.lightGreen }}
            wrapperStyle={{ flex: 1 }}
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
  title: {
    fontSize: fontSize.bodyText,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 5
  },
  name: {
    color: colors.text,
    fontSize: fontSize.secondaryText,
    marginBottom: 5,
    fontWeight: "600"
  },
  text: {
    color: colors.text,
    fontSize: fontSize.secondaryText,
    fontWeight: "500",
    marginBottom: 5
  },
  description: {
    color: colors.text50,
    fontSize: fontSize.secondaryText,
    fontWeight: "600"
  },
  price: {
    color: colors.secondaryColor,
    fontSize: fontSize.bodyText,
    fontWeight: "500",
    marginBottom: 5
  },
  bottomWrapper: {
    flexDirection: "row",
    alignItems: "center"
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15
  }
});

export default MaterialDetail;
