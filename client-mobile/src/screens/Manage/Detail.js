import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Switch,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions
} from "react-native";
import { Image } from "react-native-expo-image-cache";
import { SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Feather } from "@expo/vector-icons";
import { ImagePicker, Permissions } from "expo";
import { updateEquipment } from "../../redux/actions/equipment";
import { getGeneralEquipmentType } from "../../redux/actions/type";
import {
  getEquipmentImage,
  resetEquipmentImage
} from "../../redux/actions/equipment";
import axios from "axios";

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

const { width, height } = Dimensions.get("window");

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

const DROPDOWN_CONSTRUCTION_OPTIONS = [
  {
    id: 0,
    name: "Select your construction",
    value: "Select your construction"
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
      user: state.auth.data,
      loading: state.equipment.imageLoading,
      imageList: state.equipment.imageList,
      construction: state.contractor.constructionList
    };
  },
  dispatch =>
    bindActionCreators(
      {
        fetchUpdateEquipment: updateEquipment,
        fetchGeneralType: getGeneralEquipmentType,
        fetchGetEquipmentImages: getEquipmentImage,
        fetchResetEquipmentImage: resetEquipmentImage
      },
      dispatch
    )
)
class MyEquipmentDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      construction: null,
      constructionIndex: 0,
      generalTypeIndex: 0,
      generalType: null,
      typeIndex: 0,
      type: null,
      typeIdDefault: 0,
      isModalOpen: false,
      images: [],
      additionalSpecsFields: []
    };
  }

  componentDidMount() {
    const { id } = this.props.navigation.state.params;
    this.props.fetchGetEquipmentImages(id);
  }

  componentWillUnmount() {
    this.props.fetchResetEquipmentImage();
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
        //construction: nextProps.equipmentDetail.construction
      };
    }
    if (nextProps.imageList !== prevState.images) {
      return {
        images: nextProps.imageList
      };
    }
    return null;
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

  _handleConstructionDropdown = () => {
    const { construction } = this.props;
    const newConstructionDropdown = construction.map(item => ({
      id: item.id,
      name: item.name,
      value: item.name
    }));
    return [...DROPDOWN_CONSTRUCTION_OPTIONS, ...newConstructionDropdown];
  };

  _handleSubmitEdit = async () => {
    const { id } = this.props.navigation.state.params;
    const { user, construction } = this.props;
    const {
      data,
      typeIndex,
      generalTypeIndex,
      typeIdDefault,
      images,
      constructionIndex
    } = this.state;

    //need to optimize
    const newTypeOptions = this._handleEquipmentType(generalTypeIndex);
    let equipmentTypeId = { id: newTypeOptions[typeIndex].id };
    if (equipmentTypeId.id === 0) equipmentTypeId.id = typeIdDefault;
    const newEquipmentDetail = {
      name: data.name,
      dailyPrice: data.dailyPrice,
      description: data.description,
      thumbnailImage: { id: data.thumbnailImage.id },
      address: construction[constructionIndex - 1].address,
      latitude: construction[constructionIndex - 1].latitude,
      longitude: construction[constructionIndex - 1].longitude,
      equipmentType: { id: equipmentTypeId.id },
      contractor: { id: user.contractor.id },
      construction: {
        id: construction[constructionIndex - 1].id
      },
      availableTimeRanges: data.availableTimeRanges,
      descriptionImages: images,
      additionalSpecsValues: data.additionalSpecsValues
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

  _handleInputSpecsField = (specId, index, value) => {
    const { data } = this.state;
    // data.additionalSpecsFields[index] = {
    //   value: value,
    //   ...data.additionalSpecsFields[index]
    // };
    // console.log(...data, data.additionalSpecsValues[index]);
    const newSpecsValue = data.additionalSpecsValues.map(item =>
      item.id === specId ? { ...item, value: value } : item
    );
    this.setState({
      data: {
        ...this.state.data,
        additionalSpecsValues: newSpecsValue
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

  _handleChangeThumbnail = image => {
    this.setState({
      data: {
        ...this.state.data,
        thumbnailImage: image
      }
    });
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
    const {
      data,
      typeIndex,
      generalTypeIndex,
      images,
      construction,
      constructionIndex
    } = this.state;
    const NEW_DROPDOWN_GENERAL_TYPES_OPTIONS = this._handleGeneralEquipmentType();
    const NEW_DROPDOWN_TYPES_OPTIONS = this._handleEquipmentType(
      generalTypeIndex
    );
    console.log(data);
    return (
      <View style={{ paddingHorizontal: 15 }}>
        <View style={styles.landscapeImgWrapper}>
          <Image
            uri={
              data.thumbnailImage
                ? data.thumbnailImage.url
                : "https://www.extremesandbox.com/wp-content/uploads/Extreme-Sandbox-Corportate-Events-Excavator-Lifting-Car.jpg"
            }
            style={styles.landscapeImg}
            resizeMode={"cover"}
          />
          <TouchableOpacity
            style={styles.buttonChangeImage}
            // onPress={this._handleChangeBackgroundImage}
            onPress={() =>
              this.props.navigation.navigate("ManageImages", { id: data.id })
            }
          >
            <Feather name="camera" size={18} color={"white"} />
          </TouchableOpacity>
        </View>
        <Title
          title={"Select your thumbnail"}
          hasMore={"Add more images"}
          onPress={() =>
            this.props.navigation.navigate("ManageImages", { id: data.id })
          }
        />
        {images && images.length > 0 ? (
          <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            style={{
              marginHorizontal: -15,
              paddingHorizontal: 15
            }}
          >
            {images.map(image => (
              <TouchableOpacity
                key={image.id}
                style={[
                  { marginRight: 15 },
                  image.id === data.thumbnailImage.id
                    ? styles.imageSelected
                    : null
                ]}
                onPress={() => this._handleChangeThumbnail(image)}
              >
                <Image
                  uri={image.url}
                  resizeMode={"cover"}
                  style={{
                    height: 100,
                    width: 100,
                    borderRadius: 10
                  }}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.text}>There is no image</Text>
        )}
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
        {data.additionalSpecsValues.length > 0 ? (
          <View>
            <Title title={"Addition Specs"} />
            {data.additionalSpecsValues.map((item, index) => (
              <InputField
                key={item.id}
                label={this._capitalizeLetter(item.additionalSpecsField.name)}
                placeholder={item.additionalSpecsField.name}
                customWrapperStyle={{ marginBottom: 20 }}
                inputType="text"
                onChangeText={value =>
                  this._handleInputSpecsField(item.id, index, value)
                }
                value={item.value}
              />
            ))}
          </View>
        ) : null}
        {data.availableTimeRanges.length > 0 ? (
          <View>
            <Title title={"Available time range"} />
            {data.availableTimeRanges.map((item, index) =>
              this._renderDateRange(item, index)
            )}
          </View>
        ) : null}
        <Dropdown
          label={"Construction"}
          defaultText={"Select your construction"}
          onSelectValue={(value, index) => {
            this.setState({ construction: value, constructionIndex: index });
          }}
          options={this._handleConstructionDropdown()}
          style={{ marginBottom: 20 }}
        />
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
    const { equipmentDetail, loading, construction } = this.props;
    const { id } = this.props.navigation.state.params;
    console.log(construction);
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
              <Feather name="arrow-left" size={22} />
            </TouchableOpacity>
          )}
        >
          <Text style={styles.header}>Equipment Detail</Text>
        </Header>
        {Object.keys(equipmentDetail).length !== 0 && !loading ? (
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
    backgroundColor: colors.text68,
    width: 32,
    height: 32,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center"
  },
  calendarIcon: {
    width: 15,
    aspectRatio: 1,
    tintColor: colors.text50,
    marginRight: 3
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
  },
  imageSelected: {
    borderWidth: 1,
    borderColor: colors.secondaryColor,
    borderRadius: 10
  }
});

export default MyEquipmentDetail;
