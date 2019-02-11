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

import CustomFlatList from "../../components/CustomFlatList";
import ParallaxList from "../../components/ParallaxList";
import Loading from "../../components/Loading";
import { itemDetail, discoverData, detail } from "../../config/mockData";
import Item from "../Discover/components/Item";
import { getEquipmentDetail } from "../../redux/actions/equipment";
import ModalCalendar from "./ModalCalendar";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";
import Title from "../../components/Title";
import { Button } from "../../components/AnimatedHeader";

const { width } = Dimensions.get("window");

@connect(
  state => {
    console.log(state.equipment.detail);
    return {
      equipment: state.equipment.list
    };
  },
  dispatch => ({
    fetchGetEquipmentDetail: id => {
      dispatch(getEquipmentDetail(id));
    }
  })
)
class EquipmentDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      selectedDate: "",
      startDate: "",
      endDate: "",
      minDate: "",
      maxDate: ""
    };
  }

  componentDidMount() {
    const { id } = this.props.navigation.state.params;
    this.props.fetchGetEquipmentDetail(id);
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  selectDate = date => {
    this.setState(() => ({
      selectedDate: date
    }));
  };

  confirmDate = ({ startDate, endDate }) => {
    this.setState({
      startDate,
      endDate
    });
    const { id } = this.props.navigation.state.params;
    const equipment = this.props.equipment.find(item => item.id === id);
    this.props.navigation.navigate("Transaction", {
      equipment: equipment,
      id: id
    });
  };

  openCalendar = () => {
    this.calendar && this.calendar.open();
  };

  handleRangeDate = dates => {
    let minDate = new Date(Math.min.apply(null, dates));
    let maxDate = new Date(Math.max.apply(null, dates));
    this.setState({ minDate: minDate, maxDate: maxDate });
  };

  handleFormatDate = date => {
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
    // const {
    //   name,
    //   constructor,
    //   location,
    //   available,
    //   availableTimeRanges,
    //   status,
    //   dailyPrice,
    //   deliveryPrice,
    //   description
    // } = detail.data;
    const { id } = this.props.navigation.state.params;
    const dataFlow = this.props.equipment.find(item => item.id === id);
    console.log(dataFlow);
    const {
      name,
      constructor,
      address,
      available,
      availableTimeRanges,
      status,
      dailyPrice,
      deliveryPrice,
      description
    } = dataFlow;
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
          <View key={index} style={styles.rowWrapper}>
            <View
              style={{
                flexDirection: "column",
                justifyContent: "center"
              }}
            >
              <Text style={{ marginBottom: 10 }}>
                From: {new Date(item.beginDate).toDateString()}
              </Text>
              <Text>To: {new Date(item.endDate).toDateString()}</Text>
            </View>
          </View>
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
    console.log(new Date().toLocaleDateString());
    const { id } = this.props.navigation.state.params;
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
            <View style={styles.bottomWrapper}>
              <Text style={{ fontSize: fontSize.h4, fontWeight: "500" }}>
                {detail.data.dailyPrice}$/day
              </Text>
              {/* <ModalCalendar
                visible={this.state.modalVisible}
                handleModalVisible={this.setModalVisible}
                dates={detail.data.availableTimeRanges}
                onSelectDate={this.selectDate}
              /> */}
              <TouchableOpacity
                style={styles.checkAvailability}
                onPress={this.openCalendar}
              >
                <Text style={{ fontWeight: "bold" }}>CHECK AVAILABILITY</Text>
              </TouchableOpacity>
              <Calendar
                i18n="en"
                ref={calendar => {
                  this.calendar = calendar;
                }}
                customI18n={customI18n}
                color={color}
                format="YYYY-MM-DD"
                minDate={this.handleFormatDate(new Date())}
                maxDate="2019-03-12"
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                onConfirm={this.confirmDate}
              />
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
    height: 500,
    marginHorizontal: 15
  },
  bottomWrapper: {
    width: width,
    backgroundColor: "white",
    position: "absolute",
    zIndex: 1,
    bottom: 0,
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.secondaryColorOpacity,
    paddingHorizontal: 15
  }
});

export default EquipmentDetail;
