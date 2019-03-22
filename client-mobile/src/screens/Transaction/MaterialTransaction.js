import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert
} from "react-native";
import { SafeAreaView, NavigationActions } from "react-navigation";
import { connect } from "react-redux";
import { Feather } from "@expo/vector-icons";
import { requestMaterialTransaction } from "../../redux/actions/transaction";
import { getConstructionList } from "../../redux/actions/contractor";

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
    fetchRequestTransaction: material => {
      dispatch(requestMaterialTransaction(material));
    },
    fetchGetConstruction: contractorId => {
      dispatch(getConstructionList(contractorId));
    }
  })
)
class MaterialTransaction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: "",
      construction: "",
      constructionIndex: 0,
      location: [],
      currentLat: "",
      currentLong: "",
      quantity: null
    };
  }
  componentDidMount = async () => {
    const { user } = this.props;
    this.props.fetchGetConstruction(user.contractor.id);
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

  static getDerivedStateFromProps(props, state) {
    if (state.construction) {
      const getConstructionByAddress = props.construction.find(
        item => item.name === state.construction
      );
      if (!state.address) {
        return {
          address: getConstructionByAddress.address
        };
      }
      return null;
    }
    return undefined;
  }

  _showAlert = msg => {
    Alert.alert("Error", msg, [{ text: "OK" }], {
      cancelable: true
    });
  };

  _handleConfirmBooking = async material => {
    const { quantity, address } = this.state;
    if (quantity == 0) {
      this._showAlert("Quantity must >0");
    } else {
      const newMaterialDetail = {
        material: {
          id: material.id
        },
        quantity: quantity,
        requesterAddress: address,
        requesterLat: 10.34,
        requesterLong: 106
      };
      await this.props.fetchRequestTransaction(newMaterialDetail);
      this.props.navigation.goBack();
    }
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

  render() {
    const { material } = this.props.navigation.state.params;
    const { address, quantity } = this.state;
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
        {material ? (
          <ScrollView style={{ paddingHorizontal: 15 }}>
            <Text style={styles.text}>Name: {material.name}</Text>
            <InputField
              label={"Quantity"}
              placeholder={"Input your quantity"}
              customWrapperStyle={{ marginBottom: 20 }}
              inputType="text"
              onChangeText={value => this._handleInputChange("quantity", value)}
              value={quantity}
              keyboardType={"numeric"}
              returnKeyType={"next"}
            />
            <Dropdown
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
            <InputField
              label={"Address"}
              placeholder={"Input your address"}
              customWrapperStyle={{ marginBottom: 20 }}
              inputType="text"
              onChangeText={value => this._handleOnChangeText(value)}
              value={address}
            />
            <Button
              text={"Confirm Booking"}
              onPress={() => {
                this._handleConfirmBooking(material);
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
  header: {
    fontSize: fontSize.h4,
    fontWeight: "600"
  },
  text: {
    fontSize: fontSize.bodyText,
    fontWeight: "500"
  },
  buttonWrapper: {}
});

export default MaterialTransaction;
