import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image
} from "react-native";
import { SafeAreaView, NavigationActions } from "react-navigation";
import { connect } from "react-redux";
import { Feather } from "@expo/vector-icons";
import { sendTransactionRequest } from "../../redux/actions/transaction";
import { getConstructionList } from "../../redux/actions/contractor";
import {
  getCurrentLocation,
  autoCompleteSearch
} from "../../redux/actions/location";
import moment from "moment";

import AutoComplete from "../../components/AutoComplete";
import Dropdown from "../../components/Dropdown";
import InputField from "../../components/InputField";
import Header from "../../components/Header";
import Button from "../../components/Button";
import Loading from "../../components/Loading";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

const DROPDOWN_CONSTRUCTION_OPTIONS = [
  {
    id: 0,
    name: "Select your construction",
    value: "Select your construction"
  }
];

@connect(
  state => ({
    status: state.status,
    construction: state.contractor.constructionList,
    user: state.auth.data
  }),
  dispatch => ({
    fetchSendRequest: transactionDetail => {
      dispatch(sendTransactionRequest(transactionDetail));
    },
    fetchGetConstruction: contractorId => {
      dispatch(getConstructionList(contractorId));
    }
  })
)
class ConfirmTransaction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: "",
      lat: null,
      lng: null,
      construction: "",
      constructionIndex: 0,
      location: [],
      currentLat: "",
      currentLong: "",
      hideResults: false
    };
  }
  componentDidMount = async () => {
    const { user } = this.props;
    this.props.fetchGetConstruction(user.contractor.id);
    // const locationStatus = await grantPermission("location");
    // if (locationStatus === "granted") {
    //   const currentLocation = await Location.getCurrentPositionAsync({});
    //   const coords = currentLocation.coords;
    //   this.setState({
    //     currentLat: coords.latitude,
    //     currentLong: coords.longitude
    //   });
    // }
  };

  static getDerivedStateFromProps(props, state) {
    if (state.construction !== "Select your construction") {
      const getConstructionByAddress = props.construction.find(
        item => item.name === state.construction
      );
      if (getConstructionByAddress) {
        return {
          address: getConstructionByAddress.address
        };
      }
    }
    return null;
  }

  _handleConfirmBooking = async () => {
    const { equipment } = this.props.navigation.state.params;
    const { constructionIndex, address, lat, lng } = this.state;
    const { construction } = this.props;
    const newEquipment = {
      ...equipment,
      requesterAddress:
        constructionIndex > 0
          ? construction[constructionIndex - 1].address
          : address,
      requesterLatitude:
        constructionIndex > 0
          ? construction[constructionIndex - 1].latitude
          : lat,
      requesterLongitude:
        constructionIndex > 0
          ? construction[constructionIndex - 1].longitude
          : lng
    };
    await this.props.fetchSendRequest(newEquipment);
  };

  _handleInputChange = (field, value) => {
    this.setState({ [field]: value });
  };

  _handleOnChangeText = async address => {
    const { currentLat, currentLong } = this.state;
    this.setState({
      location: await autoCompleteSearch(address, currentLat, currentLong)
    });
  };

  _handleConstructionDropdown = () => {
    const { construction } = this.props;
    const newConstructionDropdown = construction.map(item => ({
      id: item.id,
      name: item.name,
      value: item.name
    }));
    return [...DROPDOWN_CONSTRUCTION_OPTIONS, ...newConstructionDropdown];
  };

  _renderAutoCompleteItem = item => (
    <TouchableOpacity
      style={styles.autocompleteWrapper}
      onPress={() => {
        this.setState({
          address: item.main_text + ", " + item.secondary_text,
          hideResults: true,
          lat: item.lat,
          lng: item.lng
        });
      }}
    >
      <Text style={styles.addressMainText}>{item.main_text}</Text>
      <Text style={styles.caption}>{item.secondary_text}</Text>
    </TouchableOpacity>
  );

  render() {
    const { equipment, name, price } = this.props.navigation.state.params;
    const { address, location, construction } = this.state;
    console.log(equipment);
    const end = moment(equipment.endDate);
    const begin = moment(equipment.beginDate);
    const duration = moment.duration(end.diff(begin));
    const days = duration.asDays() + 1;
    const totalPrice = days * price;
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "always", top: "always" }}
      >
        <Header
          renderLeftButton={() => (
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Feather name="arrow-left" size={24} />
            </TouchableOpacity>
          )}
        >
          <Text style={styles.header}>Review booking</Text>
        </Header>
        {equipment ? (
          <ScrollView style={{ paddingHorizontal: 15 }}>
            <Text style={styles.text}>Name: {name}</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={require("../../../assets/icons/icons8-calendar.png")}
                style={styles.calendarIcon}
                resizeMode={"contain"}
              />
              <Text style={styles.duration}>
                {`${days} ${days > 1 ? "days" : "day"}`}
              </Text>
            </View>
            <Text style={styles.startEndDate}>
              {begin.format("DD/MM/YY")} - {end.format("DD/MM/YY")}
            </Text>
            <Text style={styles.text}>Total price: {totalPrice}K</Text>
            <Dropdown
              style={{ marginVertical: 10 }}
              label={"Construction"}
              defaultText={"Select your construction"}
              onSelectValue={(value, index) => {
                this.setState({
                  construction: value,
                  constructionIndex: index
                });
              }}
              options={this._handleConstructionDropdown()}
            />
            <AutoComplete
              label={"Address"}
              placeholder={"Input your address"}
              onFocus={() => this.setState({ hideResults: false })}
              hideResults={this.state.hideResults}
              editable={
                !construction || construction === "Select your construction"
              }
              data={location}
              value={address}
              onChangeText={value => {
                this.setState({ address: value });
                this._handleOnChangeText(value);
              }}
              renderItem={item => this._renderAutoCompleteItem(item)}
            />

            <Button
              text={"Confirm Booking"}
              wrapperStyle={{ marginTop: 15 }}
              onPress={() => {
                this._handleConfirmBooking();
                this.props.navigation.goBack();
              }}
            />
          </ScrollView>
        ) : (
          <Loading />
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  autocompleteWrapper: {
    paddingBottom: 10,
    marginVertical: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.text25
  },
  header: {
    fontSize: fontSize.bodyText,
    fontWeight: "500",
    color: colors.primaryColor
  },
  text: {
    fontSize: fontSize.bodyText,
    fontWeight: "500",
    marginBottom: 5,
    color: colors.primaryColor
  },
  addressMainText: {
    fontSize: fontSize.secondaryText,
    color: colors.text,
    fontWeight: "500"
  },
  caption: {
    fontSize: fontSize.caption,
    color: colors.text50,
    fontWeight: "600"
  },
  calendarIcon: {
    width: 15,
    aspectRatio: 1,
    tintColor: colors.text50,
    marginRight: 3
  },
  duration: {
    fontSize: fontSize.secondaryText,
    color: colors.text68,
    fontWeight: "500"
  },
  startEndDate: {
    fontSize: fontSize.secondaryText,
    color: colors.text,
    fontWeight: "600",
    marginLeft: 15 + 3,
    marginTop: 5,
    marginBottom: 5
  }
});

export default ConfirmTransaction;
