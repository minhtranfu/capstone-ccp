import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  TouchableOpacity
} from "react-native";
import { SafeAreaView } from "react-navigation";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { connect } from "react-redux";

import CustomFlatList from "../../components/CustomFlatList";
import ParallaxList from "../../components/ParallaxList";
import Loading from "../../components/Loading";
import { itemDetail, discoverData, detail } from "../../config/mockData";
import Item from "../Discover/components/Item";
import { getEquipmentDetail } from "../../redux/actions/equipment";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";
import Title from "../../components/Title";
import { Button } from "../../components/AnimatedHeader";

@connect(
  state => {
    console.log(state.equipment.detail);
    return {};
  },
  dispatch => ({
    fetchGetEquipmentDetail: id => {
      dispatch(getEquipmentDetail(id));
    }
  })
)
class EquipmentDetail extends Component {
  componentDidMount() {
    const { id } = this.props.navigation.state.params;
    this.props.fetchGetEquipmentDetail(id);
  }

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
    const { images, author, availableFrom, availableTo } = itemDetail;
    const {
      name,
      constructor,
      location,
      available,
      availableTimeRanges,
      status,
      dailyPrice,
      deliveryPrice,
      description
    } = detail.data;
    console.log(images);
    return (
      <View>
        <View style={styles.textWrapper}>
          <Text style={styles.header}>{name}</Text>
          <Text style={{ color: colors.secondaryColorOpacity }}>
            {status.toUpperCase()}
          </Text>
        </View>
        <Text style={styles.text}>Constructor: {constructor.name}</Text>
        <Text style={styles.text}>Phone: {constructor.phoneNumber}</Text>
        <Title title={"Time Range Available"} />
        {availableTimeRanges.map((item, index) => (
          <TouchableOpacity key={index} style={styles.rowWrapper}>
            <View
              style={{
                flexDirection: "column",
                justifyContent: "center"
              }}
            >
              <Text style={{ marginBottom: 10 }}>From: {item.beginDate}</Text>
              <Text>To: {item.endDate}</Text>
            </View>
            <Ionicons
              name={"ios-arrow-forward"}
              size={24}
              style={{ marginRight: 15 }}
            />
          </TouchableOpacity>
        ))}
        <Title title={"Pricing"} />
        <View style={styles.rowWrapper}>
          <Text>Daily price</Text>
          <Text style={{ marginRight: 15 }}>{dailyPrice}$/day</Text>
        </View>
        <View style={styles.rowWrapper}>
          <Text>Delivery price</Text>
          <Text style={{ marginRight: 15 }}>{deliveryPrice}$/day</Text>
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
        <Text style={[styles.text, { paddingVertical: 5 }]}>
          {location.query}
        </Text>
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
        {detail ? (
          <View>
            <ParallaxList
              title={detail.data.name}
              removeTitle={true}
              hasThumbnail={true}
              hasLeft={true}
              hasFavorite={true}
              scrollElement={<Animated.ScrollView />}
              renderScrollItem={this.renderScrollItem}
            />
            <View
              style={{
                position: "fixed",
                zIndex: 1,
                bottom: 0,
                height: 50,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderTopWidth: 1,
                borderTopColor: colors.secondaryColorOpacity
              }}
            >
              <Text style={styles.text}>{detail.data.dailyPrice}$/day</Text>
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
  rowWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: 15,
    marginTop: 10,
    marginBottom: 5
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
