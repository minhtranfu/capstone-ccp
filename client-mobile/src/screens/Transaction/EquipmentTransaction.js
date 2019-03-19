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
import { sendTransactionRequest } from "../../redux/actions/transaction";
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
    user: state.contractor.info
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
      construction: "",
      constructionIndex: 0,
      location: [],
      currentLat: "",
      currentLong: ""
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

  _handleConfirmBooking = async transactionDetail => {
    await this.props.fetchSendRequest(transactionDetail);
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
    const { equipment, name } = this.props.navigation.state.params;
    const { address } = this.state;
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
            <Text style={styles.text}>Begin date: {equipment.beginDate}</Text>
            <Text style={styles.text}>End date:{equipment.endDate}</Text>
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
                this._handleConfirmBooking(equipment);
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

export default ConfirmTransaction;
