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
import Feather from "@expo/vector-icons/Feather";
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
  componentDidMount() {
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
  }

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
    }
  }

  _showAlert = msg => {
    Alert.alert("Error", msg, [{ text: "OK" }], {
      cancelable: true
    });
  };

  _handleConfirmBooking = async material => {
    const { quantity, address, constructionIndex } = this.state;
    const { construction } = this.props;
    const newMaterialDetail = {
      materialTransactionDetails: [
        {
          quantity: parseInt(quantity),
          material: {
            id: material.id
          }
        }
      ],
      supplier: { id: material.contractor.id },
      requesterAddress: address,
      requesterLat: construction[constructionIndex - 1].latitude,
      requesterLong: construction[constructionIndex - 1].longitude
    };
    console.log(newMaterialDetail);
    await this.props.fetchRequestTransaction(newMaterialDetail);
    this.props.navigation.goBack();
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
    console.log(material);
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
              style={{ marginBottom: 20 }}
            />
            <InputField
              label={"Address"}
              placeholder={"Input your address"}
              customWrapperStyle={{ marginBottom: 20 }}
              inputType="text"
              onChangeText={value => this._handleOnChangeText(value)}
              value={address}
            />
            <Text style={styles.text}>
              Total price: {quantity * material.price}K VND
            </Text>
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
    fontSize: fontSize.bodyText,
    fontWeight: "600",
    color: colors.text
  },
  text: {
    fontSize: fontSize.secondaryText,
    fontWeight: "500",
    marginBottom: 15
  },
  buttonWrapper: {}
});

export default MaterialTransaction;
