import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView,
  Modal,
  Animated,
  Alert
} from "react-native";
import { SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import { Location } from "expo";
import { bindActionCreators } from "redux";
import { DROPDOWN_OPTIONS } from "../../Utils/Constants";
import { grantPermission } from "../../redux/reducers/permission";
import { autoCompleteSearch } from "../../redux/actions/location";
import { searchEquipment } from "../../redux/actions/equipment";
import { MaterialIcons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import { getGeneralEquipmentType } from "../../redux/actions/type";
import moment from "moment";

import Loading from "../../components/Loading";
import InputField from "../../components/InputField";
import Dropdown from "../../components/Dropdown";
import SearchBar from "../../components/SearchBar";
import Header from "../../components/Header";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";
import ParallaxList from "../../components/ParallaxList";
import Title from "../../components/Title";
import Calendar from "../../components/Calendar";

@connect(
  state => {
    return {
      loading: state.type.loading,
      generalType: state.type.listGeneralEquipmentType
    };
  },
  dispatch =>
    bindActionCreators({ fetchGeneralType: getGeneralEquipmentType }, dispatch)
)
class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: "",
      location: [],
      address: null,
      lat: null,
      lng: null,
      generalTypeIndex: 0,
      generalType: null,
      typeIndex: 0,
      type: null,
      checked: 0,
      calendarVisible: false,
      beginDate: moment(),
      endDate: moment().add(30, "days"),
      construction: null,
      constructionIndex: 0
    };
  }

  componentDidMount = async () => {
    this.props.fetchGeneralType();
    const locationStatus = await grantPermission("location");
    if (locationStatus === "granted") {
      const currentLocation = await Location.getCurrentPositionAsync({});
      const coords = currentLocation.coords;
      this.setState({
        currentLat: coords.latitude,
        currentLong: coords.longitude
      });
    }
  };

  componentWillUnmount = () => {
    this.setState({ location: [], currentLat: "", currentLong: "" });
  };

  _handleOnChangeText = async value => {
    const { lat, lng } = this.state;
    this.setState({
      location: await autoCompleteSearch(value, lat, lng)
    });
  };

  //Create new dropdown options for general type
  _handleGeneralEquipmentType = () => {
    const { generalType } = this.props;
    let newGeneralEquipmentTypeArray = generalType.map(item => ({
      id: item.id,
      name: item.name,
      value: item.name
    }));
    return [...DROPDOWN_OPTIONS.CATEGORY, ...newGeneralEquipmentTypeArray];
  };

  //Create new dropdown options for type
  _handleEquipmentType = generalTypeIndex => {
    const { generalType } = this.props;
    let generalTypeArray = this._handleGeneralEquipmentType();
    let result = generalType.find(
      item => item.id === generalTypeArray[generalTypeIndex].id
    );

    if (result) {
      let newEquipmentTypeArray = result.equipmentTypes.map(item => ({
        id: item.id,
        name: item.name,
        value: item.name,
        additionalSpecsFields: item.additionalSpecsFields
      }));
      return [...DROPDOWN_OPTIONS.TYPE, ...newEquipmentTypeArray];
    }
    return DROPDOWN_OPTIONS.TYPE;
  };

  _showAlert = msg => {
    Alert.alert("Error", msg, [{ text: "OK" }], {
      cancelable: true
    });
  };

  _handleSearch = () => {
    const {
      currentLat,
      currentLong,
      generalTypeIndex,
      typeIndex,
      query,
      address,
      lat,
      lng,
      beginDate,
      endDate,
      keyword
    } = this.state;
    const newTypeOptions = this._handleEquipmentType(generalTypeIndex);
    let id = newTypeOptions[typeIndex].id;

    const location = {
      query,
      lquery: address,
      lat: lat,
      long: lng
    };

    //q: keyword
    const equipment = {
      beginDate: moment(beginDate).format("YYYY-MM-DD"),
      endDate: moment(endDate).format("YYYY-MM-DD"),
      equipmentCat: this.state.generalType,
      equipmentCatIndex: this.state.generalTypeIndex,
      equipmentTypeId: id,
      equipmentTypeIndex: this.state.typeIndex,
      equipmentType: this.state.type,
      q: keyword,
      location: address ? location : null
    };

    const searchParams = {
      beginDate: moment(beginDate).format("YYYY-MM-DD"),
      endDate: moment(endDate).format("YYYY-MM-DD"),
      equipmentTypeId: id !== 0 ? id : "",
      q: keyword,
      lquery: address || "",
      long: lng || "",
      lat: lat || ""
    };
    this.props.navigation.navigate("Result", {
      equipment,
      searchParams
    });
  };

  _setCalendarVisible = visible => {
    this.setState({ calendarVisible: visible });
  };

  _onSelectDate = (beginDate, endDate, visible) => {
    const newToDate = endDate ? endDate : moment(beginDate).add(30, "days");
    this.setState({
      beginDate,
      endDate: newToDate,
      calendarVisible: visible
    });
  };

  _renderCalendar = (beginDate, endDate) =>
    this.state.calendarVisible &&
    beginDate &&
    endDate && (
      <Calendar
        visible={this.state.calendarVisible}
        onLeftButtonPress={() => this._setCalendarVisible(false)}
        onSelectDate={this._onSelectDate}
        fromDate={beginDate}
        endDate={endDate}
      />
    );

  _renderRowItem = (item, index) => {
    return (
      <TouchableOpacity
        key={index}
        style={styles.buttonWrapper}
        onPress={() =>
          this.setState({
            query: item,
            address: item.main_text + ", " + item.secondary_text,
            lat: item.lat,
            lng: item.lng
          })
        }
      >
        <Text style={styles.addressShort}>{item.main_text}</Text>
        <Text style={styles.addressFull}>{item.secondary_text}</Text>
      </TouchableOpacity>
    );
  };

  _renderScrollContent = () => {
    const {
      location,
      generalTypeIndex,
      address,
      beginDate,
      endDate
    } = this.state;
    return (
      <View style={{ paddingTop: 15, paddingHorizontal: 15, flex: 1 }}>
        <SearchBar
          style={{ height: 56, marginBottom: 5 }}
          handleOnChangeText={value => this.setState({ keyword: value })}
          placeholder={"Enter equipment keyword"}
          onSubmitEditing={this._handleSearch}
          renderRightButton={() => (
            <TouchableOpacity onPress={this._handleSearch}>
              <Text
                style={{
                  fontSize: fontSize.caption,
                  color: colors.primaryColor,
                  fontWeight: "600"
                }}
              >
                Search
              </Text>
            </TouchableOpacity>
          )}
        />
        <Dropdown
          style={{ marginBottom: 10 }}
          isHorizontal={true}
          label={"Category"}
          defaultText={DROPDOWN_OPTIONS.CATEGORY[0].name}
          onSelectValue={(value, index) => {
            if (index === 0) {
              this.setState({
                type: DROPDOWN_OPTIONS.CATEGORY[0].name,
                typeIndex: 0
              });
            }
            this.setState({ generalTypeIndex: index, generalType: value });
          }}
          options={this._handleGeneralEquipmentType()}
        />
        <Dropdown
          isHorizontal={true}
          label={"Type"}
          defaultText={DROPDOWN_OPTIONS.TYPE[0].name}
          onSelectValue={(value, index) =>
            this.setState({ type: value, typeIndex: index })
          }
          options={this._handleEquipmentType(generalTypeIndex)}
        />

        <TouchableOpacity
          style={styles.dateBoxWrapper}
          onPress={() => this._setCalendarVisible(true)}
        >
          <View style={styles.rowWrapper}>
            <Text style={styles.captionText}>From</Text>
            <Text style={styles.text}>
              {moment(beginDate).format("DD MMM, YYYY")}
            </Text>
          </View>
          <View style={styles.rowWrapper}>
            <Text style={[styles.captionText, { textAlign: "right" }]}>To</Text>
            <Text style={styles.text}>
              {moment(endDate).format("DD MMM, YYYY")}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.searchBoxWrapper}>
          <InputField
            label={"Receive address"}
            borderBottomWidth={0}
            placeholder={"Input your address"}
            customWrapperStyle={{ marginTop: 5, marginBottom: -15 }}
            inputType="text"
            onChangeText={value => {
              this.setState({ address: value });
              this._handleOnChangeText(value);
            }}
            value={address}
            returnKeyType={"next"}
          />
        </View>
        {location.length > 0 ? (
          <View style={styles.columnWrapper}>
            <Title title={"Suggested locations"} />
            {location.map((item, index) => this._renderRowItem(item, index))}
          </View>
        ) : address ? (
          <Loading />
        ) : null}
      </View>
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.container} forceInset={{ top: "always" }}>
        <ParallaxList
          title={"Search Equipment"}
          hasLeft={true}
          scrollElement={<Animated.ScrollView />}
          renderScrollItem={this._renderScrollContent}
        />
        {this._renderCalendar(this.state.beginDate, this.state.endDate)}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  columnWrapper: {
    flexDirection: "column"
  },
  searchBoxWrapper: {
    backgroundColor: colors.gray,
    paddingHorizontal: 15,
    paddingBottom: 10,
    paddingTop: 5,
    marginTop: 10,
    borderRadius: 5
  },
  dateBoxWrapper: {
    flexDirection: "row",
    backgroundColor: colors.gray,
    paddingHorizontal: 15,
    paddingBottom: 15,
    marginTop: 10,
    borderRadius: 5,
    justifyContent: "space-between"
  },
  buttonWrapper: {
    justifyContent: "center",
    flexDirection: "column",
    paddingTop: 10,
    paddingBottom: 15,
    paddingHorizontal: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.text25
  },
  typeButtonWrapper: {
    paddingHorizontal: 15,
    height: 30,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.primaryColor,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    paddingTop: 10,
    fontSize: fontSize.h4,
    fontWeight: "500"
  },
  text: {
    fontSize: fontSize.bodyText,
    color: colors.text,
    fontWeight: "600"
  },
  addressShort: {
    fontSize: fontSize.bodyText,
    color: colors.text,
    fontWeight: "600",
    marginBottom: 5
  },
  addressFull: {
    fontSize: fontSize.secondaryText,
    color: colors.text50
  },
  secondaryText: {
    fontSize: fontSize.secondaryText,
    color: colors.secondaryColorOpacity
  },
  dateButton: {
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 5,
    marginRight: 10
  },
  captionText: {
    fontSize: fontSize.caption,
    color: colors.text50,
    fontWeight: "500",
    marginTop: 10,
    marginBottom: 5
  }
});

export default Search;
