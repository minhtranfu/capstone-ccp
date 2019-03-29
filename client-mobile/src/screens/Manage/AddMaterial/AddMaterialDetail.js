import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Dimensions
} from "react-native";
import { SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import Feather from "@expo/vector-icons/Feather";
import {
  getGeneralMaterialType,
  addNewMaterial
} from "../../../redux/actions/material";
import { ImagePicker, Permissions } from "expo";
import axios from "axios";

import TextArea from "../../../components/TextArea";
import Button from "../../../components/Button";
import Dropdown from "../../../components/Dropdown";
import InputField from "../../../components/InputField";
import Loading from "../../../components/Loading";
import Header from "../../../components/Header";

import colors from "../../../config/colors";
import fontSize from "../../../config/fontSize";

const maxLength = 100;
const { width, height } = Dimensions.get("window");

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
      constructionIndex: 0,
      image: null,
      submitLoading: false
    };
  }

  componentDidMount() {
    this.props.fetchGeneralType();
  }

  _capitalizeFirstLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  _handleAddImage = async () => {
    const { status } = await Permissions.getAsync(Permissions.CAMERA_ROLL);
    if (status === "granted") {
      let result = await ImagePicker.launchImageLibraryAsync();
      if (!result.cancelled) {
        this.setState({
          image: result.uri
        });
      }
    }
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

  _handleSubmit = async () => {
    const {
      name,
      manufacturer,
      description,
      price,
      typeIndex,
      constructionIndex,
      image
    } = this.state;
    const { constructionList } = this.props;
    const newTypeOptions = this._handleMaterialTypeDropdown();
    const form = new FormData();
    this.setState({ submitLoading: true });
    form.append("image", {
      uri: image,
      type: "image/jpg",
      name: "image.jpg"
    });
    const res = await axios.post(`storage/equipmentImages`, form, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    console.log(res);
    const material = {
      name,
      manufacturer,
      description,
      price: parseFloat(price),
      materialType: {
        id: newTypeOptions[typeIndex].id
      },
      //constructionIndex based on construction dropdown
      construction: {
        id: constructionList[constructionIndex - 1].id
      },
      thumbnailImageUrl: res.data[0].url
    };
    await this.props.fetchAddNewMaterial(material);
    this.props.navigation.dismiss();
  };

  _validData = () => {
    const { name, manufacturer, description, price, image } = this.state;
    if (name && manufacturer && description && price && image) {
      return true;
    }
    return false;
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
      constructionIndex,
      image
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
        <Dropdown
          label={"General Material Type"}
          defaultText={"Select your general material type"}
          onSelectValue={(value, index) =>
            this.setState({ generalTypeIndex: index, generalType: value })
          }
          options={this._handleGeneralMaterialTypeDropdown()}
          style={{ marginBottom: 20 }}
        />
        <Dropdown
          label={"Type"}
          defaultText={"Select your type"}
          onSelectValue={(value, index) =>
            this.setState({ type: value, typeIndex: index })
          }
          options={this._handleMaterialTypeDropdown()}
          style={{ marginBottom: 20 }}
        />
        <Dropdown
          label={"Construction"}
          defaultText={"Select your construction"}
          onSelectValue={(value, index) => {
            this.setState({ construction: value, constructionIndex: index });
          }}
          options={this._handleConstructionDropdown()}
          style={{ marginBottom: 20 }}
        />
        <Text style={styles.label}>Description</Text>
        <TextArea
          value={description}
          onChangeText={value => this.setState({ description: value })}
        />
        <View style={{ marginVertical: 15 }}>
          <Text style={styles.label}>Add your thumbnail image</Text>
          {image ? (
            <Image
              source={{ uri: image }}
              style={styles.landscapeImg}
              resizeMode={"cover"}
            />
          ) : null}
          <Button text={"Add Image"} onPress={this._handleAddImage} />
        </View>
      </View>
    );
  };

  render() {
    const { loading } = this.props;
    return (
      <SafeAreaView style={styles.container} forceInset={{ top: "always" }}>
        <Header
          renderLeftButton={() => (
            <TouchableOpacity onPress={() => this.props.navigation.dismiss()}>
              <Feather name={"x"} size={24} />
            </TouchableOpacity>
          )}
        >
          <Text style={styles.text}>Add material</Text>
        </Header>
        {!loading ? <ScrollView>{this._renderItem()}</ScrollView> : <Loading />}
        {this.state.submitLoading ? (
          <View
            style={{
              position: "absolute",
              backgroundColor: "white",
              width: width,
              height: height
            }}
          >
            <Loading />
          </View>
        ) : (
          <Button
            text={"Submit"}
            onPress={this._handleSubmit}
            disabled={!this._validData()}
            buttonStyle={{
              backgroundColor: this._validData()
                ? colors.secondaryColor
                : "#a5acb8",
              borderRadius: 0
            }}
          />
        )}
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
  },
  landscapeImg: {
    height: 200,
    marginBottom: 15
  }
});

export default AddMaterialDetail;
