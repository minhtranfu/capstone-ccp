import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Switch,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal
} from "react-native";
import { SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import { Feather } from "@expo/vector-icons";
import { ImagePicker, Permissions } from "expo";
import { updateEquipment } from "../../redux/actions/equipment";
import { getGeneralEquipmentType } from "../../redux/actions/type";

import Calendar from "../../components/Calendar";
import InputField from "../../components/InputField";
import Dropdown from "../../components/Dropdown";
import Header from "../../components/Header";
import Button from "../../components/Button";
import Loading from "../../components/Loading";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";
import WithRangeCalendar from "../../components/WithRangeCalendar";
import Title from "../../components/Title";

const DROPDOWN_GENERAL_TYPES_OPTIONS = [
  {
    id: 0,
    name: "Select general equipment types",
    value: "All"
  }
];

const DROPDOWN_TYPES_OPTIONS = [
  {
    id: 0,
    name: "Select equipment types",
    value: "All"
  }
];

const COLORS = {
  AVAILABLE: "#4DB781", //green
  DENIED: "#FF5C5C", //red
  PENDING: "#FFDF49", //yellow
  DELIVERING: "#7199FE", //blue,
  RENTING: "#FFDF49",
  default: "red"
};

@connect(
  (state, ownProps) => {
    const { id } = ownProps.navigation.state.params;
    return {
      equipmentDetail: state.equipment.contractorEquipment.find(
        item => item.id === id
      ),
      generalType: state.type.listGeneralEquipmentType,
      loading: state.type.loading
    };
  },
  dispatch => ({
    fetchUpdateEquipment: (equipmentId, equipment) => {
      dispatch(updateEquipment(equipmentId, equipment));
    },
    fetchGeneralType: () => {
      dispatch(getGeneralEquipmentType());
    }
  })
)
class MyEquipmentDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      generalTypeIndex: 0,
      generalType: null,
      typeIndex: 0,
      type: null,
      typeIdDefault: 0,
      isModalOpen: false
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    //Check data is update
    if (
      Object.keys(prevState.data).length === 0 &&
      nextProps.equipmentDetail !== prevState.data
    ) {
      return {
        data: nextProps.equipmentDetail,
        generalType:
          nextProps.equipmentDetail.equipmentType.generalEquipment.name,
        type: nextProps.equipmentDetail.equipmentType.name,
        typeIdDefault: nextProps.equipmentDetail.equipmentType.id
      };
    } else return null;
  }

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
        value: this._capitalizeLetter(item.name)
      }));
      return [...DROPDOWN_TYPES_OPTIONS, ...newEquipmentTypeArray];
    }
    return DROPDOWN_TYPES_OPTIONS;
  };

  _handleChangeBackgroundImage = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === "granted") {
      let result = await ImagePicker.launchImageLibraryAsync();
    }
  };

  _handleSubmitEdit = () => {
    const { id } = this.props.navigation.state.params;
    const { data, typeIndex, generalTypeIndex, typeIdDefault } = this.state;

    //need to optimize
    const newTypeOptions = this._handleEquipmentType(generalTypeIndex);
    let equipmentTypeId = { id: newTypeOptions[typeIndex].id };
    if (equipmentTypeId.id === 0) equipmentTypeId.id = typeIdDefault;

    const newEquipmentDetail = {
      name: data.name,
      dailyPrice: data.dailyPrice,
      status: "AVAILABLE",
      deliveryPrice: data.deliveryPrice,
      description: data.description,
      thumbnailImage: { id: 120 },
      address: "Phú Nhuận",
      latitude: 10.806488,
      longitude: 106.676364,
      equipmentType: { id: equipmentTypeId.id },
      contractor: { id: 13 },
      constructionId: null,
      availableTimeRanges: data.availableTimeRanges,
      descriptionImages: []
    };

    this.props.fetchUpdateEquipment(id, newEquipmentDetail);
    this.props.navigation.goBack();
  };

  _renderAvailableBottom = id => (
    <View style={styles.bottomWrapper}>
      <Button text={"Update"} onPress={this._handleSubmitEdit} />
    </View>
  );

  _renderBottomButton = (status, id) => {
    switch (status) {
      case "AVAILABLE":
        return this._renderAvailableBottom(id);
      default:
        return null;
    }
  };

  _handleInputChanged = (field, value) => {
    this.setState({
      data: {
        ...this.state.data,
        [field]: value
      }
    });
  };

  _handleDateChanged = (id, date) => {
    const { data } = this.state;
    this.setState({
      data: {
        ...data,
        availableTimeRanges: data.availableTimeRanges.map((item, index) =>
          index === id ? { ...item, ...date } : item
        )
      }
    });
  };

  _handleInputSpecsField = (specId, value) => {
    const { additionalSpecsFields, data } = this.state;
    this.setState({
      data: {
        ...data,
        additionalSpecsFields: [
          ...additionalSpecsFields,
          {
            value: value,
            additionalSpecsField: {
              id: specId
            }
          }
        ]
      }
    });
  };

  renderDateTimeModal = () => {
    const { isModalOpen, modalIndex } = this.state;
    return (
      <Modal visible={isModalOpen}>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <WithRangeCalendar
            onConfirm={date => {
              this._handleDateChanged(modalIndex, date);
              this.setState(() => ({ isModalOpen: false }));
            }}
            onClose={() => this.setState(() => ({ isModalOpen: false }))}
            single={true}
          />
        </View>
      </Modal>
    );
  };

  _renderDateRange = (item, index) => (
    <View key={index}>
      <TouchableOpacity
        onPress={() =>
          this.setState(() => ({ isModalOpen: true, modalIndex: index }))
        }
      >
        <Text>Change</Text>
      </TouchableOpacity>
      <InputField
        label={"From"}
        placeholder={"dd-mm-yyyy"}
        customWrapperStyle={{ marginBottom: 20 }}
        inputType="text"
        editable={false}
        value={item.beginDate}
        returnKeyType={"next"}
      />
      <InputField
        label={"To"}
        placeholder={"dd-mm-yyyy"}
        customWrapperStyle={{ marginBottom: 20 }}
        inputType="text"
        editable={false}
        value={item.endDate}
        returnKeyType={"go"}
      />
    </View>
  );

  _renderScrollItem = () => {
    const { id } = this.props.navigation.state.params;
    const { data, typeIndex, generalTypeIndex } = this.state;
    const NEW_DROPDOWN_GENERAL_TYPES_OPTIONS = this._handleGeneralEquipmentType();
    const NEW_DROPDOWN_TYPES_OPTIONS = this._handleEquipmentType(
      generalTypeIndex
    );
    return (
      <View style={{ paddingHorizontal: 15 }}>
        <View style={styles.landscapeImgWrapper}>
          <Image
            source={{
              uri:
                "https://www.extremesandbox.com/wp-content/uploads/Extreme-Sandbox-Corportate-Events-Excavator-Lifting-Car.jpg"
            }}
            style={styles.landscapeImg}
            resizeMode={"cover"}
          />
          <TouchableOpacity
            style={styles.buttonChangeImage}
            onPress={this._handleChangeBackgroundImage}
          >
            <Feather name="camera" size={24} />
          </TouchableOpacity>
        </View>
        <Title title={"Equipment Information"} />
        <InputField
          label={"Name"}
          placeholder={"Input your equipment name"}
          placeholderTextColor={colors.text68}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          onChangeText={value => this._handleInputChanged("name", value)}
          value={data.name}
          editable={data.status === "AVAILABLE" ? true : false}
          returnKeyType={"next"}
        />
        <View style={{ flexDirection: "row" }}>
          <InputField
            label={"Daily price"}
            placeholderTextColor={colors.text68}
            customWrapperStyle={{ marginBottom: 20, marginRight: 15 }}
            inputType="text"
            onChangeText={value =>
              this._handleInputChanged("dailyPrice", parseInt(value))
            }
            editable={data.status === "AVAILABLE" ? true : false}
            value={data.dailyPrice.toLocaleString("en")}
            keyboardType={"numeric"}
            returnKeyType={"next"}
          />
          <InputField
            label={"Delivery price"}
            placeholderTextColor={colors.text68}
            customWrapperStyle={{ marginBottom: 20 }}
            inputType="text"
            editable={data.status === "AVAILABLE" ? true : false}
            onChangeText={value =>
              this._handleInputChanged("deliveryPrice", parseInt(value))
            }
            keyboardType={"numeric"}
            value={data.deliveryPrice.toLocaleString()}
          />
        </View>
        <Dropdown
          isHorizontal
          label={"Category"}
          defaultText={this.state.generalType}
          options={this._handleGeneralEquipmentType()}
          onSelectValue={(value, index) =>
            this.setState({ generalTypeIndex: index, generalType: value })
          }
        />
        <Dropdown
          isHorizontal
          style={{ marginTop: 20 }}
          label={"Type"}
          defaultText={this.state.type}
          options={this._handleEquipmentType(this.state.generalTypeIndex)}
          onSelectValue={(value, index) =>
            this.setState({ type: value, typeIndex: index })
          }
        />
        {data.availableTimeRanges.length > 0 ? (
          <View>
            <Title title={"Available time range"} />
            {data.availableTimeRanges.map((item, index) =>
              this._renderDateRange(item, index)
            )}
          </View>
        ) : null}
        {data.additionalSpecsValues.length > 0 ? (
          <View>
            <Text>Addition Specs Value</Text>
            {data.additionalSpecsValues.map((item, index) => (
              <InputField
                key={item.id}
                label={this._capitalizeLetter(item.additionalSpecsField.name)}
                placeholder={item.additionalSpecsField.name}
                customWrapperStyle={{ marginBottom: 20 }}
                inputType="text"
                onChangeText={value =>
                  this._handleInputSpecsField(item.id, value)
                }
                value={item.value}
              />
            ))}
          </View>
        ) : null}
        <InputField
          label={"Description"}
          placeholder={"Input your description"}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          onChangeText={value => this._handleInputChanged("description", value)}
          value={data.description}
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20
          }}
        >
          <View
            style={{
              width: 25,
              height: 15,
              borderRadius: 3,
              marginRight: 5,
              backgroundColor:
                COLORS[data.status ? data.status : "AVAILABLE" || "default"]
            }}
          />
          <Text style={styles.text}>
            Status: {data.status ? data.status : "AVAILABLE"}
          </Text>
        </View>
        {this._renderBottomButton(data.status, id)}
      </View>
    );
  };

  render() {
    const { equipmentDetail } = this.props;
    const { id } = this.props.navigation.state.params;
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "never", top: "always" }}
      >
        <Header
          renderLeftButton={() => (
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.goBack();
              }}
            >
              <Feather name="x" size={24} />
            </TouchableOpacity>
          )}
        >
          <Text style={styles.header}>Equipment Detail</Text>
        </Header>
        {Object.keys(equipmentDetail).length !== 0 ? (
          <ScrollView>{this._renderScrollItem()}</ScrollView>
        ) : (
          <Loading />
        )}
        {this.renderDateTimeModal()}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  bottomWrapper: {
    marginBottom: 10
  },
  landscapeImgWrapper: {
    height: 200,
    marginBottom: 0
  },
  landscapeImg: {
    flex: 1,
    marginHorizontal: -15
  },
  buttonChangeImage: {
    position: "absolute",
    bottom: 15,
    right: 15,
    backgroundColor: colors.primaryColor,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center"
  },
  header: {
    color: colors.primaryColor,
    fontSize: fontSize.bodyText,
    fontWeight: "600"
  },
  title: {
    fontSize: fontSize.bodyText,
    fontWeight: "500",
    color: colors.text
  }
});

export default MyEquipmentDetail;
