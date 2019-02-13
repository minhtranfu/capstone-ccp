import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView
} from "react-native";
import { SafeAreaView, NavigationActions } from "react-navigation";
import { connect } from "react-redux";
import { Ionicons, Feather } from "@expo/vector-icons";
import {
  getGeneralEquipmentType,
  getEquipmentType
} from "../../../redux/actions/type";

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
    value: "all"
  }
];

const DROPDOWN_TYPES_OPTIONS = [
  {
    id: 0,
    name: "Select equipment types",
    value: "all"
  }
];

@connect(
  state => {
    console.log("Type", state.type);
    console.log("Equipment", state.equipment);
    return {
      generalType: state.type.listGeneralEquipmentType,
      type: state.type.listType
    };
  },
  dispatch => ({
    fetchGeneralType: () => {
      dispatch(getGeneralEquipmentType());
    },
    fetchType: id => {
      dispatch(getEquipmentType(id));
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
      deliveryPrice: null
    };
  }

  componentDidMount() {
    this.props.fetchGeneralType();
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
  _handleNewGeneralEquipmentType = () => {
    const { data } = this.props.generalType;
    let newData = data.map(item => ({
      id: item.id,
      name: this._capitalizeLetter(item.name),
      value: this._capitalizeLetter(item.name)
    }));
    return [...DROPDOWN_GENERAL_TYPES_OPTIONS, ...newData];
  };

  //Create new dropdown options for type
  _handleNewEquipmentType = generalTypeIndex => {
    const { data } = this.props.generalType;
    const typeList = data.find((item, index) => index === generalTypeIndex - 1);
    let newGeneralTypeArray = this._handleNewGeneralEquipmentType();
    let result = data.find(
      item => item.id === newGeneralTypeArray[generalTypeIndex].id
    );

    if (result) {
      let newData = result.equipmentTypes.map(item => ({
        id: item.id,
        name: this._capitalizeLetter(item.name),
        value: this._capitalizeLetter(item.name)
      }));
      return [...DROPDOWN_TYPES_OPTIONS, ...newData];
    }
    return DROPDOWN_TYPES_OPTIONS;
  };

  //Create new data before move to next screen
  _handleNewData = () => {
    const {
      name,
      dailyPrice,
      typeIndex,
      generalTypeIndex,
      deliveryPrice
    } = this.state;
    const newTypeOptions = this._handleNewEquipmentType(generalTypeIndex);
    let type = { id: newTypeOptions[typeIndex].id };
    const newData = {
      name: name,
      dailyPrice: dailyPrice,
      deliveryPrice: deliveryPrice,
      equipmentType: type
    };
    return newData;
  };

  _renderScrollViewItem = () => {
    const {
      name,
      dailyPrice,
      type,
      generalType,
      deliveryPrice,
      generalTypeIndex,
      typeIndex
    } = this.state;
    const NEW_DROPDOWN_GENERAL_TYPES_OPTIONS = this._handleNewGeneralEquipmentType();
    const NEW_DROPDOWN_TYPES_OPTIONS = this._handleNewEquipmentType(
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
        <InputField
          label={"Daily price"}
          placeholder={"$"}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          onChangeText={value => this.setState({ dailyPrice: value })}
          value={dailyPrice}
          keyboardType={"numeric"}
          returnKeyType={"next"}
        />
        <InputField
          label={"Delivery price"}
          placeholder={"$"}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          onChangeText={value => this.setState({ deliveryPrice: value })}
          keyboardType={"numeric"}
          value={deliveryPrice}
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
      onPress={() =>
        result
          ? null
          : this.props.navigation.navigate("AddDurationText", {
              data: this._handleNewData()
            })
      }
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
    const { generalType } = this.props;
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
        {generalType.data ? (
          <View style={{ flex: 1 }}>
            <ScrollView
              style={styles.scrollWrapper}
              contentContainerStyle={{ paddingTop: 20 }}
            >
              {this._renderScrollViewItem()}
            </ScrollView>
            <View style={styles.bottomWrapper}>
              {this._renderNextButton(result)}
            </View>
          </View>
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
  buttonStyle: {
    backgroundColor: "grey",
    borderRadius: 5,
    height: 100
  },
  titleStyle: {
    fontSize: fontSize.secondaryText
  },
  bottomWrapper: {
    backgroundColor: "transparent",
    position: "absolute",
    bottom: 30,
    right: 15,
    justifyContent: "center",
    alignItems: "flex-end"
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
  }
});

export default AddDetail;
