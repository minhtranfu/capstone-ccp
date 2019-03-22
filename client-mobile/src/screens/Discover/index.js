import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Alert,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView
} from "react-native";
import { SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import { Feather } from "@expo/vector-icons";
import { Image } from "react-native-expo-image-cache";

import Header from "../../components/Header";
import Button from "../../components/Button";
import Title from "../../components/Title";
import ParallaxList from "../../components/ParallaxList";
import CustomFlatList from "../../components/CustomFlatList";
import Item from "./components/Item";
import TopRateItem from "./components/TopRateItem";

import { discoverData } from "../../config/mockData";
import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

const RADIO_BUTON_DATA = [
  {
    id: 1,
    value: "Equipment",
    routeName: "Search",
    image:
      "http://s7d2.scene7.com/is/image/Caterpillar/CM20130904-45250-23505?$cc-s$"
  },
  {
    id: 2,
    value: "Material",
    routeName: "MaterialSearch",
    image:
      "http://hybridconstructioncy.com/wp-content/uploads/2017/01/material.png"
  },
  {
    id: 3,
    value: "Debris",
    routeName: "BidSearch",
    image:
      "https://1-800-junk-relief.com/wp-content/uploads/2018/07/Construction-Debris-Removal-3.jpg"
  }
];

@connect(state => ({
  status: state.transaction.status
}))
class Discover extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: 0
    };
  }

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

  _renderTopRate = ({ item }) => {
    return <TopRateItem uploaded={item.uploaded} price={item.price} />;
  };

  _renderItem = () => {
    const { checked } = this.state;
    return (
      <View>
        <Title
          title={"What can we help you to find"}
          style={{ paddingLeft: 15 }}
        />
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: "center",
            marginVertical: 10,
            paddingHorizontal: 15
          }}
        >
          {RADIO_BUTON_DATA.map((item, key) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.typeButtonWrapper,
                item.id === 3 ? { marginRight: 0 } : null
              ]}
              onPress={() => this.props.navigation.navigate(item.routeName)}
            >
              <Image
                uri={item.image}
                resizeMode={"cover"}
                style={styles.image}
              />
              <View style={styles.overlay}>
                <Text style={[styles.title, { color: "white" }]}>
                  {item.value}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Title title={"Near you"} style={{ paddingLeft: 15 }} />
        <CustomFlatList
          data={discoverData}
          renderItem={this._renderTopRate}
          numColumns={2}
          style={{
            paddingLeft: 15
          }}
        />
        <Button
          text={"Show more"}
          wrapperStyle={{ marginHorizontal: 15, marginBottom: 15 }}
        />
      </View>
    );
  };

  _showAlert = (title, msg) => {
    Alert.alert(title, msg, [{ text: "OK" }], {
      cancelable: true
    });
  };

  render() {
    const { status } = this.props;
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "always", top: "always" }}
      >
        {/* <Header
          renderRightButton={() => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("Cart")}
              >
                <Feather name={"shopping-cart"} size={24} />
              </TouchableOpacity>
            </View>
          )}
        >
          <Text style={styles.title}>Search</Text>
        </Header> */}
        {/* <ScrollView>{this._renderItem()}</ScrollView> */}
        <ParallaxList
          title={"Discover"}
          hasLeft={false}
          hasCart={true}
          onCartPress={() => this.props.navigation.navigate("Cart")}
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
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    paddingBottom: 5,
    paddingLeft: 5
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
    marginRight: 15
  },
  title: {
    fontSize: fontSize.h4,
    fontWeight: "500"
  },
  text: {
    fontSize: fontSize.bodyText,
    fontWeight: "500"
  },
  image: {
    width: 275,
    height: 155,
    borderRadius: 10
  }
});

export default Discover;
