import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Alert,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import { Image } from "react-native-expo-image-cache";
import i18n from "i18n-js";

import Button from "../../components/Button";
import Title from "../../components/Title";
import ParallaxList from "../../components/ParallaxList";
import CustomFlatList from "../../components/CustomFlatList";
import Item from "./components/Item";
import TopRateItem from "./components/TopRateItem";

import { discoverData } from "../../config/mockData";
import fontSize from "../../config/fontSize";

const RADIO_BUTON_DATA = [
  {
    id: 1,
    value: "Equipment",
    caption: "Find equipment rental",
    routeName: "Search",
    image:
      "http://s7d2.scene7.com/is/image/Caterpillar/CM20130904-45250-23505?$cc-s$"
  },
  {
    id: 2,
    value: "Material",
    caption: "Find & buy material",
    routeName: "MaterialSearch",
    image:
      "http://hybridconstructioncy.com/wp-content/uploads/2017/01/material.png"
  },
  {
    id: 3,
    value: "Debris",
    caption: "Find construction debris ",
    routeName: "BidSearch",
    image:
      "https://1-800-junk-relief.com/wp-content/uploads/2018/07/Construction-Debris-Removal-3.jpg"
  }
];

@connect(state => ({
  status: state.transaction.status,
  user: state.auth.data,
  language: state.contractor.language
}))
class Discover extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: 0
    };
    i18n.locale = props.language;
  }

  // componentDidMount() {
  //   console.log(this.props.language);
  //   i18n.locale = this.props.language;
  // }

  _renderDiscoverItem = ({ item }) => {
    return (
      <Item
        name={item.name}
        uploaded={item.uploaded}
        onPress={() =>
          this.props.navigation.navigate("Detail", { id: item.id })
        }
      />
    );
  };

  _renderTopRate = ({ item, index }) => {
    return (
      <TopRateItem
        uploaded={item.uploaded}
        price={item.price}
        title={item.name}
        style={{ marginRight: index % 2 === 0 ? 15 : 0 }}
      />
    );
  };

  _renderItem = () => {
    const { checked } = this.state;
    return (
      <View style={{ paddingHorizontal: 15 }}>
        <Title title={"Categories"} />

        {RADIO_BUTON_DATA.map((item, key) => (
          <TouchableOpacity
            key={key}
            style={styles.typeButtonWrapper}
            onPress={() => this.props.navigation.navigate(item.routeName)}
            activeOpacity={0.9}
          >
            <Image uri={item.image} resizeMode={"cover"} style={styles.image} />
            <View style={styles.overlay}>
              <View
                style={{
                  paddingLeft: 15,
                  height: 180,
                  zIndex: 2,
                  position: "absolute",
                  justifyContent: "center"
                }}
              >
                <Text
                  style={[
                    styles.title,
                    { color: "white", alignSelf: "center" }
                  ]}
                >
                  {item.value.toUpperCase()}
                </Text>
                <View
                  style={{
                    height: 1,
                    width: 130,
                    backgroundColor: "white",
                    alignSelf: "center"
                  }}
                />
                <Text
                  style={[
                    styles.text,
                    { color: "white", paddingTop: 5, paddingLeft: 5 }
                  ]}
                >
                  {item.caption}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        {/* <Title title={"Near you"} />
        <CustomFlatList
          style={{ marginHorizontal: -15, flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 15, paddingVertical: 5 }}
          data={discoverData}
          renderItem={this._renderTopRate}
          numColumns={2}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
        <Button text={"Show more"} wrapperStyle={{ marginBottom: 10 }} /> */}
      </View>
    );
  };

  _showAlert = (title, msg) => {
    Alert.alert(title, msg, [{ text: "Ời" }], {
      cancelable: true
    });
  };

  _handleShowCart = () => {
    const { user } = this.props;
    if (Object.keys(user).length !== 0) {
      if (user.contractor.status === "NOT_VERIFIED") {
        this._showAlert(
          "Sorry!",
          "Your account is not verified to access this action"
        );
      } else {
        this.props.navigation.navigate("Cart");
      }
    } else {
      this._showAlert("Sorry!", "You must login to access this action");
    }
  };

  render() {
    const { status } = this.props;
    return (
      <SafeAreaView style={styles.container} forceInset={{ top: "always" }}>
        <ParallaxList
          title={i18n.t("Discover")}
          hasLeft={false}
          hasCart={true}
          onCartPress={this._handleShowCart}
          scrollElement={<Animated.ScrollView />}
          renderScrollItem={this._renderItem}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    //backgroundColor: "rgba(0,0,0,0.4)",
    // justifyContent: "center",
    // alignItems: "center",
    // borderRadius: 10,
    // paddingBottom: 5,
    // paddingLeft: 5,
    // width: 150,
    // height: 180,
    zIndex: 1,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    width: 200,
    height: 0,
    borderBottomWidth: 180,
    borderBottomColor: "rgba(0,0,0,0.4)",
    borderRightWidth: 70,
    borderRightColor: "transparent",
    borderStyle: "solid"
  },
  topRateContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 15
  },
  typeButtonWrapper: {
    // paddingHorizontal: 15,
    // height: 30,
    // borderRadius: 5,
    // marginRight: 10,
    // backgroundColor: "#DDDDDD",
    // alignItems: "center",
    // justifyContent: "center"
    flex: 1,
    marginBottom: 15
  },
  title: {
    fontSize: fontSize.h3,
    fontWeight: "600"
  },
  text: {
    fontSize: fontSize.secondaryText,
    fontWeight: "500"
  },
  image: {
    height: 180,
    borderRadius: 10
  }
});

export default Discover;
