import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView,
  Modal
} from "react-native";
import { SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import { Location } from "expo";
import { grantPermission } from "../../redux/reducers/permission";
import { autoCompleteSearch } from "../../redux/actions/location";
import { searchEquipment } from "../../redux/actions/equipment";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { getGeneralEquipmentType } from "../../redux/actions/type";

import Dropdown from "../../components/Dropdown";
import SearchBar from "../../components/SearchBar";
import Header from "../../components/Header";
import { FlatList } from "react-native-gesture-handler";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

const RADIO_BUTON_DATA = [
  { id: 1, value: "Equipment" },
  { id: 2, value: "Material" },
  { id: 3, value: "Xà bần" }
];

const DROPDOWN_GENERAL_TYPES_OPTIONS = [
  {
    id: 0,
    name: "Select general equipment types",
    value: "Select general equipment types"
  }
];

const DROPDOWN_TYPES_OPTIONS = [
  {
    id: 0,
    name: "Select equipment types",
    value: "Select equipment types"
  }
];

@connect(
  state => {
    return {
      loading: state.type.loading,
      generalType: state.type.listGeneralEquipmentType
    };
  },
  dispatch => ({
    fetchGeneralType: () => {
      dispatch(getGeneralEquipmentType());
    }
  })
)
class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: [],
      currentLat: "",
      currentLong: "",
      modalVisible: false,
      fromDate: "",
      toDate: "",
      generalTypeIndex: 0,
      generalType: null,
      typeIndex: 0,
      type: null,
      checked: 0
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

  _setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  _handleOnChangeText = async address => {
    const { currentLat, currentLong } = this.state;
    this.setState({
      location: await autoCompleteSearch(address, currentLat, currentLong)
    });
  };

  _capitalizeLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  //Create new dropdown options for general type
  _handleGeneralEquipmentType = () => {
    const { generalType } = this.props;
    let newGeneralEquipmentTypeArray = generalType.map(item => ({
      id: item.id,
      name: this._capitalizeLetter(item.name),
      value: this._capitalizeLetter(item.name)
    }));
    return [...DROPDOWN_GENERAL_TYPES_OPTIONS, ...newGeneralEquipmentTypeArray];
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
        name: this._capitalizeLetter(item.name),
        value: this._capitalizeLetter(item.name),
        additionalSpecsFields: item.additionalSpecsFields
      }));
      return [...DROPDOWN_TYPES_OPTIONS, ...newEquipmentTypeArray];
    }
    return DROPDOWN_TYPES_OPTIONS;
  };

  _renderButton = (text, onPress) => (
    <TouchableOpacity style={styles.buttonWrapper}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={styles.text}>{text}</Text>
      </View>
    </TouchableOpacity>
  );

  _formatDate = date => {
    let newDate = new Date(date);
    let year = newDate.getFullYear();
    let month = newDate.getMonth() + 1;
    let day = newDate.getDate();
    return year + "-" + month + "-" + day;
  };

  _handleDateRange = days => {
    let today = new Date();
    let result = today.setDate(today.getDate() + days);
    return this._formatDate(result);
  };

  _renderRowItem = (item, index) => {
    const {
      currentLat,
      currentLong,
      fromDate,
      toDate,
      generalTypeIndex,
      typeIndex
    } = this.state;
    const beginDate = this._formatDate(Date.now());
    const endDate = this._handleDateRange(30);
    const newTypeOptions = this._handleEquipmentType(generalTypeIndex);
    let id = newTypeOptions[typeIndex].id;
    return (
      <TouchableOpacity
        key={index}
        style={styles.buttonWrapper}
        onPress={() =>
          this.props.navigation.navigate("Result", {
            query: item,
            lat: currentLat,
            long: currentLong,
            beginDate: beginDate,
            endDate: endDate,
            equipmentTypeId: id ? id : ""
          })
        }
      >
        <Text style={styles.text}>{item.main_text}</Text>
        <Text style={styles.secondaryText}>{item.secondary_text}</Text>
      </TouchableOpacity>
    );
  };

  render() {
    const {
      location,
      fromDate,
      toDate,
      generalTypeIndex,
      checked
    } = this.state;
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "always", top: "always" }}
      >
        <SearchBar
          handleOnChangeText={this._handleOnChangeText}
          renderRightButton={() => (
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Text style={styles.text}>Cancel</Text>
            </TouchableOpacity>
          )}
        />
        <View style={{ paddingHorizontal: 15 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 5
            }}
          >
            {RADIO_BUTON_DATA.map((item, key) =>
              checked === key ? (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.typeButtonWrapper,
                    {
                      backgroundColor: colors.secondaryColor,
                      borderColor: colors.secondaryColor
                    }
                  ]}
                >
                  <Text style={styles.text}>{item.value}</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  key={key}
                  style={styles.typeButtonWrapper}
                  onPress={() => this.setState({ checked: key })}
                >
                  <Text style={styles.text}>{item.value}</Text>
                </TouchableOpacity>
              )
            )}
          </View>
          <Dropdown
            isHorizontal={true}
            label={"General Equipment Type"}
            defaultText={"All"}
            onSelectValue={(value, index) =>
              this.setState({ generalTypeIndex: index, generalType: value })
            }
            options={this._handleGeneralEquipmentType()}
          />
          <Dropdown
            isHorizontal={true}
            label={"Type"}
            defaultText={"All"}
            onSelectValue={(value, index) =>
              this.setState({ type: value, typeIndex: index })
            }
            options={this._handleEquipmentType(generalTypeIndex)}
          />
        </View>
        <ScrollView style={{ marginTop: 10 }}>
          {location.length > 0 ? (
            <View style={styles.columnWrapper}>
              {location.map((item, index) => this._renderRowItem(item, index))}
            </View>
          ) : (
            <View style={styles.columnWrapper}>
              <TouchableOpacity style={styles.buttonWrapper}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <MaterialIcons name="my-location" size={22} />
                  <Text style={[styles.text, { paddingLeft: 10 }]}>
                    Current Location
                  </Text>
                </View>
              </TouchableOpacity>
              <Text style={styles.title}>Recently Search</Text>
              {this._renderButton("340 Nguyen Tat Thanh")}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
  },
  columnWrapper: {
    flexDirection: "column",
    paddingHorizontal: 15
  },
  buttonWrapper: {
    justifyContent: "center",
    flexDirection: "column",
    marginTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.secondaryColorOpacity
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
    fontWeight: "500"
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
  }
});

export default Search;
