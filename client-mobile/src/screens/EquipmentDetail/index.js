import React, { Component } from "react";
import { View, Text, StyleSheet, Animated, Image } from "react-native";
import { SafeAreaView } from "react-navigation";
import MapView, { Marker } from "react-native-maps";

import CustomFlatList from "../../components/CustomFlatList";
import ParallaxList from "../../components/ParallaxList";
import Loading from "../../components/Loading";
import { itemDetail, discoverData } from "../../config/mockData";
import Item from "../Discover/components/Item";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";
import Title from "../../components/Title";
import { Button } from "../../components/Header";

class EquipmentDetail extends Component {
  renderSuggestionItem = ({ item }) => {
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
  renderScrollItem = () => {
    const {
      images,
      name,
      author,
      description,
      location,
      availableFrom,
      availableTo
    } = itemDetail;
    console.log(images);
    return (
      <View>
        <View style={styles.textWrapper}>
          <Text style={styles.header}>{name}</Text>
          <Text style={styles.header}>{author}</Text>
        </View>
        <View style={styles.textWrapper}>
          <Text style={{ color: colors.secondaryColorOpacity }}>Available</Text>
          <Text style={styles.text}>
            {availableFrom}-{availableTo}
          </Text>
        </View>
        <Title title={"Description"} />
        <Text style={styles.description}>{description}</Text>

        <Title title={"Images"} />
        <CustomFlatList
          data={images}
          renderItem={image => (
            <Image
              source={image.item}
              style={styles.image}
              resizeMode={"cover"}
            />
          )}
          numColumns={3}
          contentContainerStyle={{
            marginHorizontal: 15,
            marginVertical: 10
          }}
        />
        <Title title={"Location"} />
        <Text style={[styles.text, { paddingVertical: 5 }]}>{location}</Text>
        <MapView
          style={styles.mapWrapper}
          initialRegion={{
            latitude: 10.831668,
            longitude: 106.682495,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
        >
          <Marker
            coordinate={{ latitude: 10.831668, longitude: 106.682495 }}
            title={"Me"}
          />
        </MapView>
        <Title title={"Suggestion"} />
        <CustomFlatList
          data={discoverData}
          renderItem={this.renderSuggestionItem}
          isHorizontal={true}
          contentContainerStyle={{
            marginTop: 10
          }}
        />
      </View>
    );
  };

  render() {
    const { id } = this.props.navigation.state.params;
    return (
      <SafeAreaView style={styles.container}>
        {itemDetail ? (
          <View>
            <ParallaxList
              title={itemDetail.name}
              removeTitle={true}
              background={"a"}
              hasLeft={true}
              hasFavorite={true}
              scrollElement={<Animated.ScrollView />}
              renderScrollItem={this.renderScrollItem}
            />
            <View
              style={{
                backgroundColor: "red",
                position: "fixed",
                zIndex: 1,
                bottom: 0,
                height: 50,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <Text>
                {itemDetail.prices[0].price}/ per{" "}
                {itemDetail.prices[0].duration}
              </Text>
              <Text>CHECK AVAILABILITY</Text>
            </View>
          </View>
        ) : (
          <Loading />
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  textWrapper: {
    flexDirection: "row",
    paddingHorizontal: 15,
    justifyContent: "space-between",
    alignItems: "center"
  },
  header: {
    color: colors.secondaryColor,
    fontSize: fontSize.h4,
    fontWeight: "500"
  },
  text: {
    color: colors.secondaryColor,
    fontSize: fontSize.secondaryText,
    paddingLeft: 15
  },
  description: {
    color: colors.secondaryColor,
    fontSize: fontSize.secondaryText,
    paddingLeft: 15
  },
  image: {
    width: 120,
    height: 120,
    marginRight: 10,
    marginTop: 5
  },
  mapWrapper: {
    flex: 1,
    height: 500,
    marginHorizontal: 15
  }
});

export default EquipmentDetail;
