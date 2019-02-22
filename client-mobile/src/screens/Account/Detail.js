import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView
} from "react-native";
import { SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import { Feather } from "@expo/vector-icons";
import { updateConstruction } from "../../redux/actions/contractor";

import Header from "../../components/Header";
import InputField from "../../components/InputField";
import Button from "../../components/Button";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

@connect(
  state => ({}),
  dispatch => ({
    fetchUpdateConstruction: (contractorId, constructionId, construction) => {
      dispatch(updateConstruction(contractorId, constructionId, construction));
    }
  })
)
class ConstructionDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: props.navigation.state.params.address,
      name: props.navigation.state.params.name
    };
  }

  _showAlert = msg => {
    Alert.alert("Error", msg, [{ text: "OK" }], {
      cancelable: true
    });
  };

  _handleInputChange = (property, value) => {
    this.setState({ [property]: value });
  };

  _handleSubmitButton = () => {
    const { contractorId, constructionId } = this.props.navigation.state.params;
    const { address, name } = this.state;
    const construction = {
      name: name,
      address: address,
      longitude: 10.312,
      latitude: 10.312
    };
    try {
      this.props.fetchUpdateConstruction(
        contractorId,
        constructionId,
        construction
      );
    } catch (error) {
      this._showAlert(error);
    }
    this.props.navigation.goBack();
  };

  render() {
    const { address, name } = this.state;
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "never", top: "always" }}
      >
        <Header
          renderLeftButton={() => (
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Feather name="x" size={24} />
            </TouchableOpacity>
          )}
        >
          <Text style={styles.header}>Edit your construction</Text>
        </Header>
        <ScrollView
          style={{ paddingHorizontal: 15, flex: 1, flexDirection: "column" }}
        >
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
          <InputField
            label={"Address"}
            placeholder={"Input your address"}
            placeholderTextColor={colors.text68}
            customWrapperStyle={{ marginBottom: 20 }}
            inputType="text"
            onChangeText={value => this._handleInputChange("address", value)}
            value={address}
            returnKeyType={"next"}
          />
          <Button text={"Submit"} onPress={() => this._handleSubmitButton()} />
        </ScrollView>
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
  }
});

export default ConstructionDetail;
