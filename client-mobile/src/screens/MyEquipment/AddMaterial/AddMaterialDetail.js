import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput
} from "react-native";
import { SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import Feather from "@expo/vector-icons/Feather";
import {
  getGeneralMaterialType,
  addNewMaterial
} from "../../../redux/actions/material";

import Button from "../../../components/Button";
import Dropdown from "../../../components/Dropdown";
import InputField from "../../../components/InputField";
import Loading from "../../../components/Loading";
import Header from "../../../components/Header";

import colors from "../../../config/colors";
import fontSize from "../../../config/fontSize";

const maxLength = 100;

const DROPDOWN_GENERAL_MATERIALS_TYPES_OPTIONS = [
  {
    id: 0,
    name: "Select general material types",
    value: "Select general material types"
  }
];

const DROPDOWN_MATERIALS_TYPES_OPTIONS = [
  {
    id: 0,
    name: "Select material types",
    value: "Select material types",
    additionalSpecsFields: []
  }
];

@connect(
  state => ({
    loading: state.material.loading,
    generalType: state.material.generalMaterialType
  }),
  dispatch => ({
    fetchGeneralType: () => {
      dispatch(getGeneralMaterialType());
    },
    fetchAddNewMaterial: material => {
      dispatch(addNewMaterial(material));
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
      <View style={{ paddingHorizontal: 15 }}>
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
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={{
            height: 200,
            borderColor: "#000000",
            borderWidth: StyleSheet.hairlineWidth
          }}
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
        <Button text={"Submit"} />
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
        <Header
          renderLeftButton={() => (
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Feather name={"chevron-left"} size={24} />
            </TouchableOpacity>
          )}
        >
          <Text style={styles.text}>Add construction material</Text>
        </Header>
        {!loading ? <ScrollView>{this._renderItem()}</ScrollView> : <Loading />}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  text: {
    fontSize: fontSize.bodyText,
    fontWeight: "500"
  },
  label: {
    fontSize: fontSize.secondaryText,
    color: colors.text68,
    fontWeight: "400",
    marginBottom: 10
  }
});

export default AddMaterialDetail;
