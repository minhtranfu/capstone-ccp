import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Alert
} from "react-native";
import { SafeAreaView, NavigationActions } from "react-navigation";
import { connect } from "react-redux";
import { Ionicons, Feather } from "@expo/vector-icons";
import { getGeneralEquipmentType } from "../../../redux/actions/type";
import {
  getCurrentLocation,
  autoCompleteSearch
} from "../../../redux/actions/location";
import { bindActionCreators } from "redux";
import { getConstructionList } from "../../../redux/actions/contractor";
import axios from "axios";
import AutoComplete from "../../../components/AutoComplete";

import Loading from "../../../components/Loading";
import Header from "../../../components/Header";
import Dropdown from "../../../components/Dropdown";
import InputField from "../../../components/InputField";

import colors from "../../../config/colors";
import fontSize from "../../../config/fontSize";

const { width } = Dimensions.get("window");

const config = {
  image: "https://ak4.picdn.net/shutterstock/videos/6731134/thumb/1.jpg"
};

const DROPDOWN_GENERAL_TYPES_OPTIONS = [
  {
    id: 0,
    name: "Select general equipment types",
    value: "Select general equipment types"
  }
];

const DROPDOWN_TYPES_OPTIONS = [
  {
    id: 0,
    name: "Select equipment types",
    value: "Select equipment types",
    additionalSpecsFields: []
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
  state => {
    return {
      loading: state.type.loading,
      generalType: state.type.listGeneralEquipmentType,
      construction: state.contractor.constructionList,
      user: state.auth.data
    };
  },
  dispatch =>
    bindActionCreators(
      {
        fetchGeneralType: getGeneralEquipmentType,
        fetchGetContrusction: getConstructionList
      },
      dispatch
    )
)
class AddDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: null,
      generalTypeIndex: 0,
      generalType: null,
      typeIndex: 0,
      type: null,
      construction: "",
      constructionIndex: 0,
      description: "",
      additionalSpecsFields: [],
      location: [],
      address: null,
      lat: null,
      lng: null
    };
  }

  componentDidMount() {
    this.props.fetchGeneralType();
    this.props.fetchGetContrusction(this.props.user.contractor.id);
  }

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

  //All data must be fill before move to next screen
  _validateEnableButton = () => {
    const { name, type, generalType, address } = this.state;
    if (name && type && generalType && address) {
      return false;
    }
    return true;
  };

  _capitalizeLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  //Create new dropdown options for general type
  _handleGeneralEquipmentType = () => {
    const { generalType } = this.props;
    let newGeneralEquipmentTypeArray = generalType.map(item => ({
      id: item.id,
      name: this._capitalizeLetter(item.name),
      value: this._capitalizeLetter(item.name)
    }));
    return [...DROPDOWN_GENERAL_TYPES_OPTIONS, ...newGeneralEquipmentTypeArray];
  };

  //Create new dropdown options for type
  _handleEquipmentType = generalTypeIndex => {
    const { generalType } = this.props;
    let generalTypeArray = this._handleGeneralEquipmentType();
    let result = generalType.find(
      item => item.id === generalTypeArray[generalTypeIndex].id
    );

    if (result) {
      let newEquipmentTypeArray = result.equipmentTypes.map(item => ({
        id: item.id,
        name: this._capitalizeLetter(item.name),
        value: this._capitalizeLetter(item.name),
        additionalSpecsFields: item.additionalSpecsFields
      }));
      return [...DROPDOWN_TYPES_OPTIONS, ...newEquipmentTypeArray];
    }

    return DROPDOWN_TYPES_OPTIONS;
  };

  _handleInputSpecsField = (specId, value) => {
    const { additionalSpecsFields } = this.state;
    if (!additionalSpecsFields) {
      additionalSpecsFields = [];
    }
    additionalSpecsFields[specId] = {
      value: value,
      additionalSpecsField: {
        id: specId
      }
    };
    this.setState({ additionalSpecsFields });
  };

  _handleAdditionalSpecsField = () => {
    const { generalTypeIndex, typeIndex } = this.state;
    const newTypeOptions = this._handleEquipmentType(generalTypeIndex);
    // console.log(newTypeOptions[typeIndex]);
    if (
      newTypeOptions[typeIndex] &&
      newTypeOptions[typeIndex].additionalSpecsFields.length > 0
    ) {
      return (
        <View>
          <Text style={styles.text}>Additional Specs Fields</Text>
          {newTypeOptions[typeIndex].additionalSpecsFields.map(item => (
            <InputField
              key={item.id}
              label={this._capitalizeLetter(item.name)}
              placeholder={item.name}
              customWrapperStyle={{ marginBottom: 20 }}
              inputType="text"
              onChangeText={value =>
                this._handleInputSpecsField(item.id, value)
              }
              returnKeyType={"next"}
            />
          ))}
        </View>
      );
    }
    return null;
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

  _formatNumber = num => {
    if (num) {
      return num.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return num;
  };

  _showAlert = msg => {
    Alert.alert("Error", msg, [{ text: "OK" }], {
      cancelable: true
    });
  };

  //Create new data before move to next screen
  _handleSubmit = () => {
    const {
      name,
      typeIndex,
      generalTypeIndex,
      description,
      construction,
      additionalSpecsFields,
      address,
      lat,
      lng
    } = this.state;
    const newTypeOptions = this._handleEquipmentType(generalTypeIndex);
    let type = { id: newTypeOptions[typeIndex].id };
    const findAddressByCons = this.props.construction.find(
      item => item.address === address
    );
    if (!address) {
      this._showAlert("Address must be not null");
    } else {
      const equipment = {
        name: name,
        description: description,
        equipmentType: type,
        address: address,
        longitude: findAddressByCons ? findAddressByCons.longitude : lng,
        latitude: findAddressByCons ? findAddressByCons.latitude : lat,
        additionalSpecsValues:
          additionalSpecsFields.length > 1
            ? additionalSpecsFields.filter(item => item !== null)
            : []
      };
      console.log(equipment);
      this.props.navigation.navigate("AddDuration", {
        data: equipment
      });
    }
  };

  _renderScrollViewItem = () => {
    const {
      name,
      typeIndex,
      generalTypeIndex,
      description,
      construction,
      address,
      location,
      values
    } = this.state;
    const NEW_DROPDOWN_GENERAL_TYPES_OPTIONS = this._handleGeneralEquipmentType();
    const NEW_DROPDOWN_TYPES_OPTIONS = this._handleEquipmentType(
      generalTypeIndex
    );
    return (
      <View>
        <InputField
          label={"Equipment Name"}
          placeholder={"Input your equipment name"}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          onChangeText={value => this.setState({ name: value })}
          value={name}
          returnKeyType={"next"}
        />
        <Dropdown
          label={"General Equipment Type"}
          defaultText={NEW_DROPDOWN_GENERAL_TYPES_OPTIONS[0].name}
          onSelectValue={(value, index) => {
            this.setState({ generalTypeIndex: index, generalType: value });
          }}
          options={NEW_DROPDOWN_GENERAL_TYPES_OPTIONS}
          style={{ marginBottom: 20 }}
        />
        <Dropdown
          label={"Type"}
          defaultText={NEW_DROPDOWN_TYPES_OPTIONS[0].name}
          onSelectValue={(value, index) =>
            this.setState({ type: value, typeIndex: index })
          }
          value={generalTypeIndex == 0 ? DROPDOWN_TYPES_OPTIONS[0].value : null}
          options={NEW_DROPDOWN_TYPES_OPTIONS}
          style={{ marginBottom: 20 }}
        />
        {this._handleAdditionalSpecsField()}
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("AddConstruction")}
        >
          <Text style={[styles.text, { color: colors.secondaryColor }]}>
            Create new address
          </Text>
        </TouchableOpacity>
        <Dropdown
          label={"Construction"}
          defaultText={"Select your construction"}
          onSelectValue={(value, index) => {
            this.setState({ construction: value, constructionIndex: index });
          }}
          options={this._handleConstructionDropdown()}
          style={{ marginBottom: 20 }}
        />
        {address ? (
          <View style={{ marginBottom: 15 }}>
            <Text style={styles.label}>Address</Text>
            <Text style={styles.address}>{address}</Text>
          </View>
        ) : null}
        <InputField
          label={"Description"}
          placeholder={"Input your description"}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          onChangeText={value => this.setState({ description: value })}
          value={description}
        />
      </View>
    );
  };

  _renderNextButton = result => (
    <TouchableOpacity
      style={[
        styles.buttonWrapper,
        result ? styles.buttonDisable : styles.buttonEnable
      ]}
      disabled={result}
      onPress={() => (result ? null : this._handleSubmit())}
    >
      <Text style={result ? styles.textDisable : styles.textEnable}>Next</Text>
      <Ionicons
        name="ios-arrow-forward"
        size={23}
        color={"white"}
        style={{ marginTop: 3 }}
      />
    </TouchableOpacity>
  );

  render() {
    const { generalType, loading } = this.props;
    const result = this._validateEnableButton();
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "always", top: "always" }}
      >
        <Header
          renderLeftButton={() => (
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.dispatch(NavigationActions.back())
              }
            >
              <Feather name="chevron-left" size={24} />
            </TouchableOpacity>
          )}
        >
          <Text style={styles.header}>Add Detail</Text>
        </Header>
        {!loading ? (
          <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
            <ScrollView
              style={styles.scrollWrapper}
              contentContainerStyle={{ paddingTop: 20 }}
            >
              {this._renderScrollViewItem()}
              <View style={styles.bottomWrapper}>
                {this._renderNextButton(result)}
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
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
  scrollWrapper: {
    flex: 1,
    paddingHorizontal: 15
  },
  bottomWrapper: {
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingBottom: 20
  },
  buttonWrapper: {
    marginRight: 15,
    paddingVertical: 5,
    width: 80,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row"
  },
  textEnable: {
    fontSize: fontSize.bodyText,
    fontWeight: "500",
    color: "white",
    marginRight: 8
  },
  textDisable: {
    fontSize: fontSize.bodyText,
    fontWeight: "500",
    color: colors.white,
    marginRight: 8
  },
  buttonEnable: {
    backgroundColor: colors.primaryColor
  },
  buttonDisable: {
    backgroundColor: colors.text25
  },
  header: {
    fontSize: fontSize.bodyText,
    fontWeight: "500",
    color: colors.text
  },
  text: {
    fontSize: fontSize.bodyText,
    fontWeight: "500",
    paddingVertical: 15
  },
  caption: {
    fontSize: fontSize.caption,
    color: colors.text50,
    fontWeight: "600"
  },
  label: {
    fontSize: fontSize.caption,
    color: colors.text50,
    fontWeight: "500",
    marginBottom: 8
  },
  address: {
    fontSize: fontSize.bodyText,
    color: colors.text,
    fontWeight: "500",
    marginBottom: 5
  }
});

export default AddDetail;
