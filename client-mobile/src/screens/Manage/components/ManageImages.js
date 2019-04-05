import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image as RNImage,
  Alert
} from "react-native";
import { Image } from "react-native-expo-image-cache";
import { SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  getEquipmentImage,
  deleteEquipmentImage,
  insertImageToEquipmentList
} from "../../../redux/actions/equipment";
import axios from "axios";
import { ImagePicker, Permissions } from "expo";
import Feather from "@expo/vector-icons/Feather";

import Header from "../../../components/Header";
import Button from "../../../components/Button";
import ParallaxList from "../../../components/ParallaxList";
import Title from "../../../components/Title";
import Loading from "../../../components/Loading";

import colors from "../../../config/colors";
import fontSize from "../../../config/fontSize";

@connect(
  state => ({
    loading: state.equipment.imageLoading,
    imageList: state.equipment.imageList
  }),
  dispatch =>
    bindActionCreators(
      {
        fetchGetEquipmentImages: getEquipmentImage,
        fetchDeteleEquipmentImage: deleteEquipmentImage,
        fetchInsertImage: insertImageToEquipmentList
      },
      dispatch
    )
)
class ManageImages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataChanged: false,
      images: [],
      uploadedImages: [],
      progress: null,
      loading: null
    };
  }

  componentDidMount() {
    const { id } = this.props.navigation.state.params;
    this.props.fetchGetEquipmentImages(id);
  }

  _handleAddImage = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === "granted") {
      let result = await ImagePicker.launchImageLibraryAsync();
      if (!result.cancelled) {
        this.setState({ images: [...this.state.images, result.uri] });
      }
    }
  };

  _showAlert = (title, msg) => {
    Alert.alert(title, msg, [{ text: "OK" }], {
      cancelable: true
    });
  };

  _renderHeader = () => {
    return (
      <Button
        text={"Add new image"}
        onPress={this._handleAddImage}
        wrapperStyle={{ marginHorizontal: 15, marginVertical: 15 }}
      />
    );
  };

  _handleSave = async () => {
    const { images } = this.state;
    const { id } = this.props.navigation.state.params;
    const form = new FormData();
    this.setState({ submitLoading: true });
    images.map(item =>
      form.append("image", {
        uri: item,
        type: "image/jpg",
        name: "image.jpg"
      })
    );
    try {
      console.log(images);
      const res = await axios.post(`storage/equipmentImages`, form, {
        headers: { "Content-Type": "multipart/form-data" }
        // onUploadProgress: progressEvent => {
        //   console.log(
        //     "Upload progress: " +
        //       Math.round((progressEvent.loaded / progressEvent.total) * 100) +
        //       "%"
        //   );
        // }
      });
      const newImage = res.data.map(item => {
        return { id: item.id };
      });
      console.log(newImage);
      this.props.fetchInsertImage(id, newImage);
      this.props.navigation.goBack();
    } catch (error) {
      this.setState({ submitLoading: false });
      this._showAlert(error);
    }
  };

  _handleRemove = rowIndex => {
    this.setState({
      images: this.state.images.filter((item, index) => index !== rowIndex)
    });
  };

  _renderScrollViewContent = () => {
    const { imageList } = this.props;
    const { images } = this.state;
    const { id } = this.props.navigation.state.params;
    return (
      <View
        style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap" }}
      >
        {imageList.length > 0
          ? imageList.map(item => (
              <View style={{ flex: 1, height: 120 }}>
                <Image
                  key={item.id}
                  uri={item.url}
                  resizeMode={"contain"}
                  style={{ flex: 1, height: 120 }}
                />
                <TouchableOpacity
                  style={styles.iconDelete}
                  onPress={() =>
                    this.props.fetchDeteleEquipmentImage(id, item.id)
                  }
                >
                  <Feather name={"x"} size={20} color={colors.secondaryColor} />
                </TouchableOpacity>
              </View>
            ))
          : null}
        {images.length > 0
          ? images.map((item, index) => (
              <View style={{ flex: 1, height: 120 }}>
                <RNImage
                  key={index}
                  source={{ uri: item }}
                  resizeMode={"cover"}
                  style={{ flex: 1, height: 120 }}
                />
                <TouchableOpacity
                  style={styles.iconDelete}
                  onPress={() => this._handleRemove(index)}
                >
                  <Feather name={"x"} size={20} color={colors.secondaryColor} />
                </TouchableOpacity>
              </View>
            ))
          : null}
      </View>
    );
  };

  _checkImageIsNull = () => {
    const { images } = this.state;
    const { imageList } = this.props;
    if (images.length > 0 || imageList.length > 0) {
      return true;
    }
    return false;
  };

  render() {
    const { loading, imageList } = this.props;
    const { dataChanged } = this.state;
    return (
      <SafeAreaView style={styles.container} forceInset={{ top: "always" }}>
        <Header
          renderLeftButton={() => (
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Feather name={"chevron-left"} size={24} />
            </TouchableOpacity>
          )}
        >
          <Text style={styles.text}>Manage equipment image</Text>
        </Header>
        {!loading ? (
          <View style={{ flex: 1 }}>
            {this._renderHeader()}
            <ScrollView>{this._renderScrollViewContent()}</ScrollView>
            <SafeAreaView
              forceInset={{ bottom: "always" }}
              style={{
                backgroundColor: dataChanged ? colors.secondaryColor : "#a5acb8"
              }}
            >
              <Button
                text={"Save"}
                disabled={!this._checkImageIsNull()}
                onPress={this._handleSave}
                buttonStyle={
                  this._checkImageIsNull()
                    ? styles.buttonEnable
                    : styles.buttonDisable
                }
              />
            </SafeAreaView>
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    fontSize: fontSize.bodyText,
    fontWeight: "500",
    color: colors.text
  },
  iconDelete: {
    position: "absolute",
    bottom: 5,
    right: 5,
    width: 20,
    height: 20
  },
  buttonEnable: {
    backgroundColor: colors.primaryColor
  },
  buttonDisable: {
    backgroundColor: colors.text25
  }
});

export default ManageImages;
