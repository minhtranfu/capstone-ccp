import React, { Component } from "react";
import { SafeAreaView } from "react-navigation";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { autoCompleteSearch } from "../../redux/actions/location";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { createConstruction } from "../../redux/actions/contractor";
import Feather from "@expo/vector-icons/Feather";

import InputField from "../../components/InputField";
import AutoComplete from "../../components/AutoComplete";
import ParallaxList from "../../components/ParallaxList";
import Header from "../../components/Header";
import Button from "../../components/Button";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

@connect(
  state => ({
    contractor: state.contractor.detail
  }),
  dispatch =>
    bindActionCreators(
      { fetchCreateConstruction: createConstruction },
      dispatch
    )
)
class AddConstruction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      address: "",
      lat: null,
      lng: null,
      location: null,
      hideResults: false
    };
  }

  _handleInputChange = (property, value) => {
    this.setState({ [property]: value });
  };

  _handleAddressChange = async address => {
    this.setState({
      location: await autoCompleteSearch(address, null, null)
    });
  };

  _checkInput = () => {
    const { address, name } = this.state;
    if (address && name) return true;
    return false;
  };

  _handleSubmitButton = () => {
    const { contractor } = this.props;
    const { address, name, lat, lng } = this.state;
    const construction = {
      name: name,
      address: address,
      longitude: lng,
      latitude: lat
    };
    this.props.fetchCreateConstruction(contractor.id, construction);
    this.props.navigation.goBack();
  };

  _renderAutoCompleteItem = item => (
    <TouchableOpacity
      key={Math.random()}
      style={styles.autocompleteWrapper}
      onPress={() => {
        this.setState({
          address: item.main_text + ", " + item.secondary_text,
          lat: item.lat,
          lng: item.lng,
          hideResults: true
        });
      }}
    >
      <Text style={styles.addressMainText}>{item.main_text}</Text>
      <Text style={styles.caption}>{item.secondary_text}</Text>
    </TouchableOpacity>
  );

  _renderItem = () => {
    const { address, name, location } = this.state;
    return (
      <View style={{ paddingHorizontal: 15, paddingTop: 15 }}>
        <InputField
          label={"Name"}
          placeholder={"Input your construction name"}
          placeholderTextColor={colors.text68}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          onChangeText={value => this._handleInputChange("name", value)}
          value={name}
          returnKeyType={"next"}
        />
        <AutoComplete
          label={"Address"}
          placeholder={"Input your address"}
          onFocus={() => this.setState({ hideResults: false })}
          hideResults={this.state.hideResults}
          data={location}
          value={address}
          onChangeText={value => {
            this.setState({ address: value });
            this._handleAddressChange(value);
          }}
          renderItem={item => this._renderAutoCompleteItem(item)}
        />
      </View>
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.container} forceInset={{ top: "always" }}>
        <Header
          renderLeftButton={() => (
            <TouchableOpacity onPress={() => this._setModalVisible(false)}>
              <Feather name="x" size={24} />
            </TouchableOpacity>
          )}
        >
          <Text style={styles.header}>Add your construction</Text>
        </Header>
        <ScrollView>{this._renderItem()}</ScrollView>
        <SafeAreaView forceInset={{ bottom: "always" }}>
          <Button
            text={"Submit"}
            onPress={this._handleSubmitButton}
            bordered={false}
            disabled={!this._checkInput()}
            buttonStyle={{
              backgroundColor: this._checkInput()
                ? colors.secondaryColor
                : colors.notValidate
            }}
          />
        </SafeAreaView>
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
    fontWeight: "500",
    color: colors.text
  }
});

export default AddConstruction;
