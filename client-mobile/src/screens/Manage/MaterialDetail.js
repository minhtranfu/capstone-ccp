import React, { Component } from "react";
import { SafeAreaView } from "react-navigation";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { Image } from "react-native-expo-image-cache";
import { connect } from "react-redux";
import { editMaterial } from "../../redux/actions/material";
import { ImagePicker, Permissions } from "expo";
import { getGeneralMaterialType } from "../../redux/actions/material";
import Feather from "@expo/vector-icons/Feather";
import axios from "axios";

import Button from "../../components/Button";
import TextArea from "../../components/TextArea";
import InputField from "../../components/InputField";
import Dropdown from "../../components/Dropdown";
import Header from "../../components/Header";
import Loading from "../../components/Loading";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

const DROPDOWN_CONSTRUCTION_OPTIONS = [
  {
    id: 0,
    name: "Select your construction",
    value: "Select your construction"
  }
];

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

@connect(
  (state, ownProps) => {
    const { id } = ownProps.navigation.state.params;
    return {
      materialDetail: state.material.materialList.find(item => item.id === id),
      loading: state.material.loading,
      generalType: state.material.generalMaterialType,
      constructionList: state.contractor.constructionList
    };
  },
  dispatch => ({
    fetchUpdateMaterialDetail: (materialId, material) => {
      dispatch(editMaterial(materialId, material));
    },
    fetchGeneralType: () => {
      dispatch(getGeneralMaterialType());
    }
  })
)
class MyMaterialDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      generalType: null,
      type: null,
      generalTypeIndex: 0,
      generalType: null,
      typeIndex: 0,
      type: null,
      typeIdDefault: 0,
      image: null,
      submitLoading: null
    };
  }

  componentDidMount() {
    this.props.fetchGeneralType();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    //Check data is update
    if (
      Object.keys(prevState.data).length === 0 &&
      nextProps.materialDetail !== prevState.data
    ) {
      return {
        data: nextProps.materialDetail,
        generalType:
          nextProps.materialDetail.materialType.generalMaterialType.name,
        type: nextProps.materialDetail.materialType.name,
        typeIdDefault: nextProps.materialDetail.materialType.id
      };
    } else return null;
  }

  _capitalizeLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  _handleInputChanged = (field, value) => {
    this.setState({
      data: {
        ...this.state.data,
        [field]: value
      }
    });
  };

  _handleChangeBackgroundImage = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
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
      name: this._capitalizeLetter(item.name),
      value: this._capitalizeLetter(item.name)
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
    const { data, typeIndex, constructionIndex } = this.state;
    const { constructionList } = this.props;
    const newTypeOptions = this._handleMaterialTypeDropdown();
    const form = new FormData();
    this.setState({ submitLoading: true });
    form.append("image", {
      uri: image,
      type: "image/jpg",
      name: "image.jpg"
    });
    try {
      const res = await axios.post(`storage/equipmentImages`, form, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const material = {
        name: data.name,
        manufacturer: data.manufacturer,
        description: data.description,
        price: parseFloat(data.price),
        materialType: {
          id: newTypeOptions[typeIndex].id
        },
        construction: {
          id: constructionList[constructionIndex - 1].id
        },
        thumbnailImageUrl: res.data[0].url
      };
      await this.props.fetchUpdateMaterialDetail(data.id, material);
      this.props.navigation.goBack();
    } catch (error) {
      this.setState({ submitLoading: true });
      this.props.navigation.goBack();
    }
  };

  _renderScrollView = () => {
    const { data, typeIndex, generalTypeIndex, image } = this.state;
    return (
      <View>
        <View style={styles.landscapeImgWrapper}>
          <Image
            uri={image ? image : data.thumbnailImageUrl}
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
        <InputField
          label={"Material name"}
          placeholder={"Input your material name"}
          placeholderTextColor={colors.text68}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          onChangeText={value => this._handleInputChanged("name", value)}
          value={data.name}
          returnKeyType={"next"}
        />
        <InputField
          label={"Manufacturer"}
          placeholder={"Input your manufacturer"}
          placeholderTextColor={colors.text68}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          onChangeText={value =>
            this._handleInputChanged("manufacturer", value)
          }
          value={data.manufacturer}
          returnKeyType={"next"}
        />
        <InputField
          label={"Price"}
          placeholder={"Input your price"}
          placeholderTextColor={colors.text68}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          onChangeText={value =>
            this._handleInputChanged("price", parseInt(value))
          }
          value={data.price.toLocaleString("en")}
          keyboardType={"numeric"}
          returnKeyType={"next"}
        />
        <InputField
          label={"Unit"}
          placeholder={"Input your manufacturer"}
          placeholderTextColor={colors.text68}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          onChangeText={value => this._handleInputChanged("unit", value)}
          value={data.unit}
          returnKeyType={"next"}
        />
        <Dropdown
          style={{ marginBottom: 20 }}
          label={"General Material Type"}
          defaultText={"Select your general material type"}
          onSelectValue={(value, index) =>
            this.setState({ generalTypeIndex: index, generalType: value })
          }
          options={this._handleGeneralMaterialTypeDropdown()}
        />
        <Dropdown
          style={{ marginBottom: 20 }}
          label={"Type"}
          defaultText={"Select your type"}
          onSelectValue={(value, index) =>
            this.setState({ type: value, typeIndex: index })
          }
          options={this._handleMaterialTypeDropdown()}
        />
        <Dropdown
          style={{ marginBottom: 20 }}
          label={"Construction"}
          defaultText={"Select your construction"}
          onSelectValue={(value, index) => {
            this.setState({ construction: value, constructionIndex: index });
          }}
          options={this._handleConstructionDropdown()}
        />
        <TextArea
          value={data.description}
          onChangeText={value => this._handleInputChanged("description", value)}
        />
        <Button text={"Submit"} onPress={this._handleSubmit} />
      </View>
    );
  };

  render() {
    const { generalType, loading } = this.props;
    const { submitLoading } = this.state;
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "always", top: "always" }}
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
          <Text style={styles.text}>Material Detail</Text>
        </Header>
        {submitLoading ? <Loading /> : null}
        {!loading ? (
          <ScrollView
            contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 15 }}
          >
            {this._renderScrollView()}
          </ScrollView>
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
  landscapeImgWrapper: {
    flex: 1
  },
  landscapeImg: {
    height: 200,
    marginBottom: 15
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
  overlay: {
    flex: 1
  },
  text: {
    fontSize: fontSize.bodyText,
    fontWeight: "500"
  }
});

export default MyMaterialDetail;
