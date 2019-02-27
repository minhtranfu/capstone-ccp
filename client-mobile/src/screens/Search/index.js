import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import { Location } from "expo";
import { grantPermission } from "../../redux/reducers/permission";
import { autoCompleteSearch } from "../../redux/actions/location";
import { searchEquipment } from "../../redux/actions/equipment";
import { MaterialIcons } from "@expo/vector-icons";

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
      currentLong: ""
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

  _renderRowItem = (item, index) => (
    <TouchableOpacity
      key={index}
      style={styles.buttonWrapper}
      onPress={() =>
        this.props.navigation.navigate("Result", {
          query: item,
          lat: this.state.currentLat,
          long: this.state.currentLong
        })
      }
    >
      <Text style={styles.text}>{item.main_text}</Text>
      <Text style={styles.secondaryText}>{item.secondary_text}</Text>
    </TouchableOpacity>
  );

  render() {
    const { location } = this.state;
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
  }
});

export default Search;
