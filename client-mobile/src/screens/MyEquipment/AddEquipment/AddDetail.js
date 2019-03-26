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
import Autocomplete from "react-native-autocomplete-input";

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
      construction: state.contractor.constructionList
    };
  },
  dispatch => ({
    fetchGeneralType: () => {
      dispatch(getGeneralEquipmentType());
    }
  })
)
class AddDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      equipmentImage: config.image,
      pickerValue: "Select an option",
      name: null,
      dailyPrice: null,
      generalTypeIndex: 0,
      generalType: null,
      typeIndex: 0,
      type: null,
      construction: "",
      constructionIndex: 0,
      deliveryPrice: null,
      description: "",
      additionalSpecsFields: [],
      location: [],
      hideResults: false,
      address: null
    };
  }

  componentDidMount() {
    this.props.fetchGeneralType();
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
    } else {
      return {
        address: null
      };
    }
  }

  //All data must be fill before move to next screen
  _validateEnableButton = () => {
    const { name, dailyPrice, type, generalType, deliveryPrice } = this.state;
    if (name && dailyPrice && type && generalType && deliveryPrice) {
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
    this.setState({
      additionalSpecsFields: [
        ...additionalSpecsFields,
        {
          value: value,
          additionalSpecsField: {
            id: specId
          }
        }
      ]
    });
  };

  _handleAdditionalSpecsField = () => {
    const { generalTypeIndex, typeIndex } = this.state;
    const newTypeOptions = this._handleEquipmentType(generalTypeIndex);
    if (
      newTypeOptions[typeIndex].additionalSpecsFields &&
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
      dailyPrice,
      typeIndex,
      generalTypeIndex,
      deliveryPrice,
      description,
      construction,
      additionalSpecsFields,
      address
    } = this.state;
    const newTypeOptions = this._handleEquipmentType(generalTypeIndex);
    let type = { id: newTypeOptions[typeIndex].id };
    const getConstructionByAddress = this.props.construction.find(
      item => item.address === address
    );

    if (!address) {
      this._showAlert("Address must be not null");
    } else {
      const equipment = {
        name: name,
        dailyPrice: parseInt(dailyPrice),
        deliveryPrice: parseInt(deliveryPrice),
        description: description,
        equipmentType: type,
        address: address,
        longitude: getConstructionByAddress.longitude,
        latitude: getConstructionByAddress.latitude,
        additionalSpecsValues: additionalSpecsFields
      };
      this.props.navigation.navigate("AddDurationText", {
        data: equipment
      });
    }
  };

  _handleAddressChange = async address => {
    if (address) {
      this.setState({
        location: await autoCompleteSearch(address, null, null)
      });
    } else {
      this.setState({
        location: []
      });
    }
  };

  _renderScrollViewItem = () => {
    const {
      name,
      dailyPrice,
      typeIndex,
      generalTypeIndex,
      deliveryPrice,
      description,
      construction,
      address,
      location
    } = this.state;
    const NEW_DROPDOWN_GENERAL_TYPES_OPTIONS = this._handleGeneralEquipmentType();
    const NEW_DROPDOWN_TYPES_OPTIONS = this._handleEquipmentType(
      generalTypeIndex
    );
    console.log(address);
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
        <InputField
          label={"Daily price"}
          placeholder={"VND"}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          onChangeText={value => this.setState({ dailyPrice: value })}
          value={this._formatNumber(dailyPrice)}
          keyboardType={"numeric"}
          returnKeyType={"next"}
        />
        <InputField
          label={"Delivery price"}
          placeholder={"VND"}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          onChangeText={value => this.setState({ deliveryPrice: value })}
          keyboardType={"numeric"}
          value={this._formatNumber(deliveryPrice)}
        />
        <Dropdown
          label={"General Equipment Type"}
          defaultText={NEW_DROPDOWN_GENERAL_TYPES_OPTIONS[0].name}
          onSelectValue={(value, index) =>
            this.setState({ generalTypeIndex: index, generalType: value })
          }
          options={NEW_DROPDOWN_GENERAL_TYPES_OPTIONS}
        />
        <Dropdown
          label={"Type"}
          defaultText={NEW_DROPDOWN_TYPES_OPTIONS[0].name}
          onSelectValue={(value, index) =>
            this.setState({ type: value, typeIndex: index })
          }
          options={NEW_DROPDOWN_TYPES_OPTIONS}
        />
        {this._handleAdditionalSpecsField()}
        <Dropdown
          label={"Construction"}
          defaultText={"Select your construction"}
          onSelectValue={(value, index) => {
            this.setState({ construction: value, constructionIndex: index });
          }}
          options={this._handleConstructionDropdown()}
        />
        <Autocomplete
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
          renderItem={item => (
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  address: item.main_text + ", " + item.secondary_text,
                  hideResults: true
                });
              }}
            >
              <Text>{item.main_text}</Text>
              <Text>{item.secondary_text}</Text>
            </TouchableOpacity>
          )}
        />
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
              <Feather name="x" size={24} />
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
    fontSize: fontSize.h4,
    fontWeight: "500"
  },
  text: {
    fontSize: fontSize.bodyText,
    fontWeight: "500",
    paddingVertical: 15
  }
});

export default AddDetail;
