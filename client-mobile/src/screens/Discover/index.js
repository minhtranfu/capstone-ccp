import React, { Component } from "react";
import { StyleSheet, Text, View, Animated } from "react-native";
import { SafeAreaView } from "react-navigation";

import Button from "../../components/Button";
import Title from "../../components/Title";
import ParallaxList from "../../components/ParallaxList";
import CustomFlatList from "../../components/CustomFlatList";
import Item from "./components/Item";
import TopRateItem from "./components/TopRateItem";

import { discoverData } from "../../config/mockData";
import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

class Discover extends Component {
  renderDiscoverItem = ({ item }) => {
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

  renderTopRate = ({ item }) => {
    return <TopRateItem uploaded={item.uploaded} price={item.price} />;
  };

  renderItem = () => {
    return (
      <View>
        <Title title={"What can we help you to find"} />
        <CustomFlatList
          data={discoverData}
          renderItem={this.renderDiscoverItem}
          isHorizontal={true}
          contentContainerStyle={{
            marginTop: 10
          }}
        />
        <Title title={"Near you"} />
        <CustomFlatList
          data={discoverData}
          renderItem={this.renderTopRate}
          numColumns={2}
          contentContainerStyle={{
            marginHorizontal: 15,
            justifyContent: "space-between"
          }}
        />
        <Button text={"Show more"} />
      </View>
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ParallaxList
          title={"Discover"}
          hasLeft={false}
          hasRight={true}
          hasFavoraite={false}
          scrollElement={<Animated.ScrollView />}
          renderScrollItem={this.renderItem}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  topRateContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 15
  }
});

export default Discover;
