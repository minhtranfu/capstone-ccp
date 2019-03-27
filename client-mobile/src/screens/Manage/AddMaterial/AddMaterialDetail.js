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

import TextArea from "../../../components/TextArea";
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
    value: "Select material types"
  }
];

const DROPDOWN_CONSTRUCTION_OPTIONS = [
  {
    id: 0,
    name: "Select your construction",
    value: "Select your construction"
  }
];

@connect(
  state => ({
    loading: state.material.loading,
    generalType: state.material.generalMaterialType,
    constructionList: state.contractor.constructionList
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
      thumbnailImageUrl: null,
      generalTypeIndex: 0,
      generalType: null,
      typeIndex: 0,
      type: null,
      construction: null,
      constructionIndex: 0
    };
  }

  componentDidMount() {
    this.props.fetchGeneralType();
  }

  _capitalizeFirstLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  _handleGeneralMaterialTypeDropdown = () => {
    const { generalType } = this.props;
    const newGeneralType = generalType.map(item => ({
      id: item.id,
      name: this._capitalizeFirstLetter(item.name),
      value: this._capitalizeFirstLetter(item.name)
    }));
    return [...DROPDOWN_GENERAL_MATERIALS_TYPES_OPTIONS, ...newGeneralType];
  };

  _handleMaterialTypeDropdown = () => {
    const { generalType } = this.props;
    const { generalTypeIndex } = this.state;
    const newGeneralMaterialType = this._handleGeneralMaterialTypeDropdown();
    let result = generalType.find(
      item => item.id === newGeneralMaterialType[generalTypeIndex].id
    );

    if (result) {
      let newMaterialTypeArray = result.materialTypes.map(item => ({
        id: item.id,
        name: this._capitalizeFirstLetter(item.name),
        value: this._capitalizeFirstLetter(item.name)
      }));
      return [...DROPDOWN_MATERIALS_TYPES_OPTIONS, ...newMaterialTypeArray];
    }
    return DROPDOWN_MATERIALS_TYPES_OPTIONS;
  };

  _handleConstructionDropdown = () => {
    const { constructionList } = this.props;
    const newConstructionDropdown = constructionList.map(item => ({
      id: item.id,
      name: item.name,
      value: item.name
    }));
    return [...DROPDOWN_CONSTRUCTION_OPTIONS, ...newConstructionDropdown];
  };

  _handleSubmit = () => {
    const {
      name,
      manufacturer,
      description,
      unit,
      price,
      typeIndex,
      constructionIndex
    } = this.state;
    const { constructionList } = this.props;
    const newTypeOptions = this._handleMaterialTypeDropdown();
    const material = {
      name,
      manufacturer,
      description,
      unit,
      price: parseFloat(price),
      materialType: {
        id: newTypeOptions[typeIndex].id
      },
      //constructionIndex based on construction dropdown
      construction: {
        id: constructionList[constructionIndex - 1].id
      },
      thumbnailImageUrl: "http://lamnha.com/images/Gach-ong.jpg"
    };
    this.props.fetchAddNewMaterial(material);
    this.props.navigation.goBack();
  };

  _renderItem = () => {
    const { generalMaterialType } = this.props;
    const {
      name,
      manufacturer,
      description,
      unit,
      price,
      generalType,
      generalTypeIndex,
      typeIndex,
      type,
      construction,
      constructionIndex
    } = this.state;
    return (
      <View style={{ paddingHorizontal: 15, paddingTop: 15 }}>
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
        <Dropdown
          label={"General Material Type"}
          defaultText={"Select your general material type"}
          onSelectValue={(value, index) =>
            this.setState({ generalTypeIndex: index, generalType: value })
          }
          options={this._handleGeneralMaterialTypeDropdown()}
        />
        <Dropdown
          label={"Type"}
          defaultText={"Select your type"}
          onSelectValue={(value, index) =>
            this.setState({ type: value, typeIndex: index })
          }
          options={this._handleMaterialTypeDropdown()}
        />
        <Dropdown
          label={"Construction"}
          defaultText={"Select your construction"}
          onSelectValue={(value, index) => {
            this.setState({ construction: value, constructionIndex: index });
          }}
          options={this._handleConstructionDropdown()}
        />
        <Text style={styles.label}>Description</Text>
        <TextArea
          value={description}
          onChangeText={value => this.setState({ description: value })}
        />
        <Button
          text={"Submit"}
          wrapperStyle={{ marginBottom: 15 }}
          onPress={() => this._handleSubmit()}
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
        <Header
          renderLeftButton={() => (
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Feather name={"chevron-left"} size={24} />
            </TouchableOpacity>
          )}
        >
          <Text style={styles.text}>Add material</Text>
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
