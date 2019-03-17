import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import Feather from "@expo/vector-icons/Feather";
import { getGeneralMaterialType } from "../../../redux/actions/material";

import Dropdown from "../../../components/Dropdown";
import InputField from "../../../components/InputField";
import Loading from "../../../components/Loading";
import Header from "../../../components/Header";

import colors from "../../../config/colors";
import fontSize from "../../../config/fontSize";

@connect(
  state => ({
    loading: state.material.loading,
    generalType: state.material.generalMaterialType
  }),
  dispatch => ({
    fetchGeneralType: () => {
      dispatch(getGeneralMaterialType());
    }
  })
)
class AddMaterialDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: null,
      description: null,
      manufacturer: null,
      unit: null,
      price: null,
      thumbnailImageUrl: null
    };
  }

  componentDidMount() {
    this.props.fetchGeneralType();
  }

  _renderItem = () => {
    const { generalMaterialType } = this.props;
    const { name, manufacturer, description, unit, price } = this.state;
    return (
      <View>
        <InputField
          label={"Material Name"}
          placeholder={"Input your equipment name"}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          onChangeText={value => this.setState({ name: value })}
          value={name}
          returnKeyType={"next"}
        />
        <InputField
          label={"Manufacturer"}
          placeholder={"Input your equipment name"}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          onChangeText={value => this.setState({ manufacturer: value })}
          value={manufacturer}
          returnKeyType={"next"}
        />
        <InputField
          label={"Price"}
          placeholder={"VND"}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          onChangeText={value => this.setState({ price: value })}
          value={price}
          keyboardType={"numeric"}
          returnKeyType={"next"}
        />
        <InputField
          label={"Unit"}
          placeholder={"Input your equipment name"}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          onChangeText={value => this.setState({ unit: value })}
          value={unit}
          returnKeyType={"next"}
        />
        <TextInput
          style={{ height: 200, borderColor: "#000000", borderWidth: 1 }}
          multiline={true}
          numberOfLines={4}
          onChangeText={value =>
            this.setState({
              description: value
            })
          }
          value={description}
          editable={true}
          maxLength={maxLength}
        />
      </View>
    );
  };

  render() {
    const { loading } = this.props;
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "always", top: "always" }}
      >
        {!loading ? <ScrollView>{this._renderItem()}</ScrollView> : <Loading />}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default AddMaterialDetail;
