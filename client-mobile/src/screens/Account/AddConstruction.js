import React, { Component } from "react";
import { SafeAreaView } from "react-navigation";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { autoCompleteSearch } from "../../redux/actions/location";

import InputField from "../../components/InputField";
import AutoComplete from "../../components/AutoComplete";
import ParallaxList from "../../components/ParallaxList";
import Header from "../../components/Header";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

class AddConstruction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      address: "",
      location: null
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

  _renderItem = () => {
    const { address, name } = this.state;
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
          editable={
            !construction || construction === "Select your construction"
          }
          data={location}
          value={address}
          onChangeText={value => {
            this.setState({ address: value });
            this._handleAddressChange(value);
          }}
          renderItem={item => this._renderAutoCompleteItem(item)}
        />
        <Button text={"Submit"} onPress={this._handleSubmitButton} />
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
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default AddConstruction;
