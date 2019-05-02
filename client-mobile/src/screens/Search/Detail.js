import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  TouchableOpacity,
  Dimensions,
  Modal,
  InteractionManager
} from "react-native";
import { SafeAreaView } from "react-navigation";
import MapView, { Marker } from "react-native-maps";
import { Ionicons, Feather } from "@expo/vector-icons";
import { connect } from "react-redux";
import DateTimePicker from "react-native-modal-datetime-picker";
import Calendar from "../../components/Calendar";
import Swiper from "react-native-swiper";
import { getEquipmentDetail } from "../../redux/actions/equipment";
import moment from "moment";

import WithRangeCalendar from "../../components/WithRangeCalendar";
import CustomFlatList from "../../components/CustomFlatList";
import ParallaxList from "../../components/ParallaxList";
import Button from "../../components/Button";
import Loading from "../../components/Loading";
import { itemDetail, discoverData, detail } from "../../config/mockData";
import Item from "../Discover/components/Item";
import { imageURL } from "../../Utils/MockData";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";
import Title from "../../components/Title";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const { width } = Dimensions.get("window");

@connect((state, ownProps) => {
  const { id } = ownProps.navigation.state.params;
  return {
    detail: state.equipment.listSearch.find(
      item => item.equipmentEntity.id === id
    ),
    isLoggedIn: state.auth.userIsLoggin
  };
})
class SearchDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: "",
      isModalOpen: false,
      date: {},
      finishedAnimation: false
    };
  }

  componentDidMount() {
    // 1: Component has been mounted off-screen
    InteractionManager.runAfterInteractions(() => {
      // 2: Component is done animating
      // 3: Do your anotherAction dispatch() here
      this.setState({ finishedAnimation: true });
    });
  }

  _handleFormatDate = date => {
    year = date.getFullYear();
    month = date.getMonth() + 1;
    dt = date.getDate();
    if (dt < 10) {
      dt = "0" + dt;
    }
    if (month < 10) {
      month = "0" + month;
    }
    return year + "-" + month + "-" + dt;
  };

  _renderSlideItem = (uri, key, loaded) => (
    <View style={styles.slide} key={key}>
      <Image
        style={styles.imageSlide}
        source={{ uri: uri }}
        resizeMode={"contain"}
      />
    </View>
  );

  _setCalendarVisible = visible => {
    this.setState({ isModalOpen: visible });
  };

  _handleAddMoreMonth = (date, month) => {
    let today = new Date(date);
    let result = today.setMonth(today.getMonth() + month);
    return this._formatDate(result);
  };

  _handleDateChanged = (id, price, selectedDate) => {
    const { name } = this.props.detail.equipmentEntity;
    const { query } = this.props.navigation.state.params;
    let newToDate = selectedDate.endDate
      ? selectedDate.endDate
      : this._handleAddMoreMonth(selectedDate.startDate, 3);
    const equipment = {
      equipmentId: id,
      beginDate: selectedDate.beginDate,
      endDate: newToDate
    };
    this.props.navigation.navigate("ConfirmTransaction", {
      equipment: equipment,
      name: name,
      query: query,
      price
    });
  };

  _renderDateTimeModal = (id, price, dateRange) => {
    const { isModalOpen } = this.state;
    const newDateRange = dateRange
      .filter(item => new Date(item.endDate) > new Date(Date.now()))
      .map(item =>
        new Date(item.beginDate) <= new Date(Date.now())
          ? { ...item, beginDate: moment(Date.now()).format("YYYY-MM-DD") }
          : item
      );
    return (
      <Modal visible={isModalOpen}>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <WithRangeCalendar
            onConfirm={date => {
              this._handleDateChanged(id, price, date);
              this.setState(() => ({ isModalOpen: false }));
            }}
            onClose={() => this.setState(() => ({ isModalOpen: false }))}
            single={true}
            availableDateRange={newDateRange}
          />
        </View>
      </Modal>
    );
  };

  _showAvailableTimeRange = (index, item) => {
    return (
      <View key={index} style={styles.dateBoxWrapper}>
        <View>
          <Text style={styles.captionText}>From</Text>
          <Text style={styles.text}>
            {moment(item.beginDate).format("DD MMM, YYYY")}
          </Text>
        </View>
        <Text
          style={{
            fontSize: fontSize.caption,
            color: colors.text68,
            fontWeight: "500",
            marginTop: 15
          }}
        >
          ▶
        </Text>
        <View>
          <Text style={[styles.captionText, { textAlign: "right" }]}>To</Text>
          <Text style={styles.text}>
            {moment(item.endDate).format("DD MMM, YYYY")}
          </Text>
        </View>
      </View>
    );
  };

  _renderScrollItem = () => {
    const {
      name,
      contractor,
      availableTimeRanges,
      status,
      address,
      dailyPrice,
      description,
      equipmentImages,
      construction
    } = this.props.detail.equipmentEntity;
    console.log(this.props.detail);
    return (
      <View
        style={{
          paddingHorizontal: 15,
          backgroundColor: "white",
          paddingTop: 15
        }}
      >
        <View style={{ justifyContent: "center" }}>
          <Text style={styles.title}>{name}</Text>
        </View>
        <View style={styles.textWrapper}>
          <View style={{ flexDirection: "column", justifyContent: "center" }}>
            <Text
              style={{
                color: colors.secondaryColorOpacity,
                fontSize: fontSize.bodyText,
                fontWeight: "500",
                marginBottom: 5
              }}
            >
              {status}
            </Text>
            <Text style={[styles.text, { fontWeight: "600", marginBottom: 5 }]}>
              {contractor.name}
            </Text>
            <Text style={styles.text}>Phone: {contractor.phoneNumber}</Text>
          </View>
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-end"
            }}
          >
            <Text style={styles.price}>{dailyPrice}K</Text>
            <Text style={styles.text}>per day</Text>
          </View>
        </View>
        <Title title={"Available Time Range"} />

        {availableTimeRanges.map((item, index) =>
          this._showAvailableTimeRange(index, item)
        )}
        <Title title={"Pricing"} />
        <View style={styles.rowWrapper}>
          <Text style={styles.text}>Daily price</Text>
          <Text style={styles.text}>{dailyPrice}K/day</Text>
        </View>
        <Title title={"Description"} />
        <Text style={styles.description}>{description}</Text>

        <Title title={"Images"} />
        {equipmentImages.length > 0 ? (
          <Swiper
            style={styles.slideWrapper}
            loop={false}
            loadMinimal
            loadMinimalSize={1}
            activeDotColor={colors.secondaryColor}
            activeDotStyle={{ width: 30 }}
          >
            {equipmentImages
              .slice(0, 4)
              .map((item, index) => this._renderSlideItem(item.url, index))}
          </Swiper>
        ) : null}

        <Title title={"Location"} />
        <Text
          style={[styles.text, { color: colors.text68, alignItems: "center" }]}
        >
          <MaterialIcons name={"location-on"} size={15} color={colors.text68} />
          {construction.address}
        </Text>
        {this.state.finishedAnimation && (
          <MapView
            style={styles.mapWrapper}
            initialRegion={{
              latitude: construction.latitude,
              longitude: construction.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
            }}
          >
            <Marker
              coordinate={{
                latitude: construction.latitude,
                longitude: construction.longitude
              }}
              title={"Contractor location"}
              image={require("../../../assets/icons/icon8-marker-96.png")}
            />
          </MapView>
        )}
      </View>
    );
  };

  render() {
    const { id } = this.props.navigation.state.params;
    const { detail } = this.props;

    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "never", top: "always" }}
      >
        <ParallaxList
          title={detail.equipmentEntity.name}
          removeTitle={true}
          hasThumbnail={true}
          imageURL={
            detail.equipmentEntity.thumbnailImage
              ? detail.equipmentEntity.thumbnailImage.url
              : "null"
          }
          hasLeft={true}
          scrollElement={<Animated.ScrollView />}
          renderScrollItem={this._renderScrollItem}
        />

        {this._renderDateTimeModal(
          detail.equipmentEntity.id,
          detail.equipmentEntity.dailyPrice,
          detail.equipmentEntity.availableTimeRanges
        )}
        <SafeAreaView
          forceInset={{ bottom: "always" }}
          style={styles.bottomWrapper}
        >
          {this.props.isLoggedIn ? (
            <Button
              text={"Book Now"}
              onPress={() => this._setCalendarVisible(true)}
              buttonStyle={{ marginTop: 0, backgroundColor: "transparent" }}
            />
          ) : (
            <Button
              text={"Login to book "}
              onPress={() => this.props.navigation.navigate("Login")}
              buttonStyle={{ marginTop: 0, backgroundColor: "transparent" }}
            />
          )}
        </SafeAreaView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  textWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  rowWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 5
  },
  title: {
    color: colors.primaryColor,
    fontSize: fontSize.h3,
    fontWeight: "700",
    marginBottom: 5
  },
  text: {
    color: colors.text,
    fontSize: fontSize.secondaryText,
    marginBottom: 5
  },
  price: {
    fontSize: fontSize.h3,
    fontWeight: "600",
    color: colors.secondaryColor,
    marginBottom: 5
  },
  description: {
    color: colors.text50,
    fontSize: fontSize.bodyText,
    fontWeight: "600"
  },
  mapWrapper: {
    flex: 1,
    height: 400,
    marginBottom: 15
  },
  bottomWrapper: {
    justifyContent: "center",
    backgroundColor: colors.secondaryColor,
    paddingHorizontal: 15,
    paddingTop: 5
  },
  slideWrapper: {
    height: 200
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "transparent"
  },
  imageSlide: {
    width: width,
    height: 200,
    backgroundColor: "transparent"
  },
  dateBoxWrapper: {
    flexDirection: "row",
    backgroundColor: colors.gray,
    paddingHorizontal: 15,
    paddingBottom: 15,
    marginTop: 10,
    marginBottom: 5,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "space-between"
  },
  captionText: {
    fontSize: fontSize.caption,
    color: colors.text50,
    fontWeight: "500",
    marginTop: 10,
    marginBottom: 5
  }
});

export default SearchDetail;
