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

import SearchBar from "../../components/SearchBar";
import Header from "../../components/Header";
import { FlatList } from "react-native-gesture-handler";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: [],
      currentLat: "",
      currentLong: "",
      modalVisible: false,
      fromDate: "",
      toDate: ""
    };
  }

  componentDidMount = async () => {
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
    const { currentLat, currentLong, fromDate, toDate } = this.state;
    const beginDate = this._formatDate(Date.now());
    const endDate = this._handleDateRange(30);
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
            endDate: endDate
          })
        }
      >
        <Text style={styles.text}>{item.main_text}</Text>
        <Text style={styles.secondaryText}>{item.secondary_text}</Text>
      </TouchableOpacity>
    );
  };

  render() {
    const { location, fromDate, toDate } = this.state;
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "always", top: "always" }}
      >
        <SearchBar
          handleOnChangeText={this._handleOnChangeText}
          renderRightButton={() => (
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Text>Cancel</Text>
            </TouchableOpacity>
          )}
        />
        {/* <View
          style={{
            marginVertical: 5,
            height: 30,
            paddingHorizontal: 15,
            flexDirection: "row"
          }}
        >
          <TouchableOpacity
            style={[
              styles.dateButton,
              fromDate && toDate ? { backgroundColor: "green" } : null
            ]}
            onPress={() => {
              this._setModalVisible(true);
            }}
          >
            <Text style={{ fontSize: fontSize.caption, fontWeight: "500" }}>
              {fromDate && toDate
                ? `${this._formatDate(fromDate)} - ${this._formatDate(toDate)}`
                : "Dates"}
            </Text>
          </TouchableOpacity> */}
        {/* </View> */}
        <ScrollView>
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
