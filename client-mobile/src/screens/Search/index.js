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
    console.log(locationStatus);
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

  handleOnChangeText = async address => {
    const { currentLat, currentLong } = this.state;
    this.setState({
      location: await autoCompleteSearch(address, currentLat, currentLong)
    });
  };

  renderRowItem = (item, index) => (
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
          handleOnChangeText={this.handleOnChangeText}
          renderRightButton={() => (
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Text>Cancel</Text>
            </TouchableOpacity>
          )}
        />
        <ScrollView>
          {location.length > 0 ? (
            <View
              style={{
                flexDirection: "column",
                paddingHorizontal: 15
              }}
            >
              {location.map((item, index) => this.renderRowItem(item, index))}
            </View>
          ) : (
            <View>
              <Text>Current Location</Text>
              <TouchableOpacity>
                <Text>Add new location</Text>
              </TouchableOpacity>
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
  buttonWrapper: {
    justifyContent: "center",
    flexDirection: "column",
    marginTop: 10,
    paddingBottom: 5,
    flex: 1,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.secondaryColorOpacity
  },
  text: {
    fontSize: fontSize.bodyText,
    color: colors.secondaryColor
  },
  secondaryText: {
    fontSize: fontSize.secondaryText,
    color: colors.secondaryColorOpacity
  }
});

export default Search;
