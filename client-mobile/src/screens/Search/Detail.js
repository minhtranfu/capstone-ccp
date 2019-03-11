import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  TouchableOpacity,
  Dimensions
} from "react-native";
import { SafeAreaView } from "react-navigation";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { connect } from "react-redux";
import DateTimePicker from "react-native-modal-datetime-picker";
import Calendar from "react-native-calendar-select";
import Swiper from "react-native-swiper";
import { getEquipmentDetail } from "../../redux/actions/equipment";

import CustomFlatList from "../../components/CustomFlatList";
import ParallaxList from "../../components/ParallaxList";
import Button from "../../components/Button";
import Loading from "../../components/Loading";
import { itemDetail, discoverData, detail } from "../../config/mockData";
import Item from "../Discover/components/Item";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";
import Title from "../../components/Title";

const { width } = Dimensions.get("window");

const IMAGE_LIST = [
  "https://s3.amazonaws.com/toyotaforklifts/content/20150902212609/mid-electric-hero.png",
  "https://s3.amazonaws.com/toyotaforklifts/content/20150902212609/mid-electric-hero.png",
  "https://s3.amazonaws.com/toyotaforklifts/content/20150902212609/mid-electric-hero.png",
  "https://s3.amazonaws.com/toyotaforklifts/content/20150902212609/mid-electric-hero.png"
];

@connect((state, ownProps) => {
  const { id } = ownProps.navigation.state.params;
  return {
    detail: state.equipment.listSearch.find(
      item => item.equipmentEntity.id === id
    )
  };
})
class SearchDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      selectedDate: "",
      startDate: "",
      endDate: "",
      minDate: "",
      maxDate: "",
      loadQueue: [0, 0, 0, 0]
    };
  }

  _setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  _selectDate = date => {
    this.setState(() => ({
      selectedDate: date
    }));
  };

  _confirmDate = ({ startDate, endDate }) => {
    const {
      id,
      dailyPrice,
      deliveryPrice,
      name
    } = this.props.detail.equipmentEntity;
    const { query } = this.props.navigation.state.params;
    console.log("Detail", query);
    this.setState({
      startDate,
      endDate
    });
    const newEquipment = {
      beginDate: this._handleFormatDate(startDate),
      endDate: this._handleFormatDate(endDate),
      requesterAddress: "Phu Nhuan",
      requesterLatitude: 123123,
      requesterLongitude: 123123,
      equipmentId: id,
      requesterId: 12
    };
    this.props.navigation.navigate("Transaction", {
      equipment: newEquipment,
      name: name,
      query: query
    });
  };

  _openCalendar = () => {
    this.calendar && this.calendar.open();
  };

  _handleRangeDate = dates => {
    let minDate = new Date(Math.min.apply(null, dates));
    let maxDate = new Date(Math.max.apply(null, dates));
    this.setState({ minDate: minDate, maxDate: maxDate });
  };

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

  _renderSuggestionItem = ({ item }) => {
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

  _loadHandle(i) {
    let loadQueue = this.state.loadQueue;
    loadQueue[i] = 1;
    this.setState({
      loadQueue
    });
  }

  _renderSlideItem = (uri, key, loaded) => (
    <View style={styles.slide} key={key}>
      <Image
        style={styles.imageSlide}
        source={{ uri: uri }}
        resizeMode={"contain"}
      />
    </View>
  );

  _renderRangeItem = (index, item) => (
    <View key={index} style={styles.rowWrapper}>
      <View style={styles.columnWrapper}>
        <Text style={[styles.text, { marginBottom: 10 }]}>
          From: {new Date(item.beginDate).toDateString()}
        </Text>
        <Text style={styles.text}>
          To: {new Date(item.endDate).toDateString()}
        </Text>
      </View>
      <TouchableOpacity>
        <Text
          style={{
            color: colors.secondaryColorOpacity,
            fontSize: fontSize.secondaryText
          }}
        >
          Add to cart
        </Text>
      </TouchableOpacity>
    </View>
  );

  _renderScrollItem = () => {
    const {
      name,
      contractor,
      location,
      available,
      availableTimeRanges,
      status,
      address,
      dailyPrice,
      deliveryPrice,
      description
    } = this.props.detail.equipmentEntity;
    return (
      <View style={{ paddingHorizontal: 15 }}>
        <View style={styles.textWrapper}>
          <Text style={styles.title}>{name}</Text>
          <Text
            style={{
              color: colors.secondaryColorOpacity,
              fontSize: fontSize.bodyText,
              fontWeight: "500"
            }}
          >
            Add to cart
          </Text>
        </View>
        <View style={styles.textWrapper}>
          <View style={{ flexDirection: "column", justifyContent: "center" }}>
            <Text style={styles.text}>Constructor: {contractor.name}</Text>
            <Text style={styles.text}>Phone: {contractor.phoneNumber}</Text>
          </View>
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-end"
            }}
          >
            <Text style={styles.price}>${dailyPrice}</Text>
            <Text style={styles.text}>per day</Text>
          </View>
        </View>
        <Title title={"Time Range Available"} />
        {availableTimeRanges.map((item, index) =>
          this._renderRangeItem(index, item)
        )}
        <Title title={"Pricing"} />
        <View style={styles.rowWrapper}>
          <Text style={styles.text}>Daily price</Text>
          <Text style={styles.text}>{dailyPrice}$/day</Text>
        </View>
        <View style={styles.rowWrapper}>
          <Text style={styles.text}>Delivery price</Text>
          <Text style={styles.text}>{deliveryPrice}$/day</Text>
        </View>

        <Title title={"Description"} />
        <Text style={styles.description}>{description}</Text>

        <Title title={"Images"} />
        <Swiper
          style={styles.slideWrapper}
          loop={false}
          loadMinimal
          loadMinimalSize={1}
          activeDotColor={"white"}
          activeDotStyle={{ width: 30 }}
        >
          {IMAGE_LIST.map((uri, index) => this._renderSlideItem(uri, index))}
        </Swiper>
        <Title title={"Location"} />
        <Text style={[styles.text, { paddingVertical: 5 }]}>{address}</Text>
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
          renderItem={this._renderSuggestionItem}
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
    const { detail } = this.props;
    let customI18n = {
      w: ["", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat", "Sun"],
      weekday: [
        "",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      text: {
        start: "Check in",
        end: "Check out",
        date: "Date",
        save: "Save",
        clear: "Reset"
      },
      date: "DD / MM" // date format
    };
    // optional property, too.
    let color = {
      subColor: "#f0f0f0"
    };
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "always", top: "always" }}
      >
        <ParallaxList
          title={detail.equipmentEntity.name}
          removeTitle={true}
          hasThumbnail={true}
          hasLeft={true}
          hasCart={true}
          scrollElement={<Animated.ScrollView />}
          renderScrollItem={this._renderScrollItem}
        />
        <View style={styles.bottomWrapper}>
          <Button
            text={"Book Now"}
            onPress={this._openCalendar}
            wrapperStyle={{ marginTop: 0 }}
          />
          <Calendar
            i18n="en"
            ref={calendar => {
              this.calendar = calendar;
            }}
            customI18n={customI18n}
            color={color}
            format="YYYY-MM-DD"
            minDate={this._handleFormatDate(new Date())}
            maxDate="2019-04-30"
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            onConfirm={this._confirmDate}
          />
        </View>
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
  columnWrapper: {
    flexDirection: "column",
    justifyContent: "center"
  },
  title: {
    color: colors.text,
    fontSize: fontSize.h4,
    fontWeight: "600"
  },
  text: {
    color: colors.text,
    fontSize: fontSize.bodyText
  },
  price: {
    fontSize: fontSize.h3,
    fontWeight: "600"
  },
  description: {
    color: colors.text,
    fontSize: fontSize.bodyText
  },
  checkAvailability: {
    alignItems: "center",
    justifyContent: "center",
    width: 180,
    height: 35,
    borderRadius: 5,
    backgroundColor: colors.primaryColor
  },
  image: {
    width: 120,
    height: 120,
    marginRight: 10,
    marginTop: 5
  },
  mapWrapper: {
    flex: 1,
    height: 500
  },
  bottomWrapper: {
    justifyContent: "center",
    width: width,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: colors.secondaryColorOpacity,
    paddingHorizontal: 15,
    marginBottom: 5,
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
  loadingView: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,.5)"
  }
});

export default SearchDetail;
