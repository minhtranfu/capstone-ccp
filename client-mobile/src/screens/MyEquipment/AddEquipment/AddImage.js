import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Dimensions
} from "react-native";
import { ImagePicker, Permissions } from "expo";
import { SafeAreaView, NavigationActions } from "react-navigation";
import { Feather } from "@expo/vector-icons";
import { connect } from "react-redux";
import { Location, ImageManipulator } from "expo";
import { grantPermission } from "../../../redux/reducers/permission";
import { addEquipment } from "../../../redux/actions/equipment";
import { uploadImage, deleteImageById } from "../../../redux/actions/upload";
import {
  getAddressByLatLong,
  getLatLongByAddress
} from "../../../redux/actions/location";
import axios from "axios";
import Progress from "react-native-progress";

import Loading from "../../../components/Loading";
import Header from "../../../components/Header";
import Button from "../../../components/Button";

import colors from "../../../config/colors";
import fontSize from "../../../config/fontSize";

@connect(
  state => ({
    imageUrl: state.upload.imageURL,
    loading: state.upload.loading
  }),
  dispatch => ({
    fetchUploadImage: image => {
      dispatch(uploadImage(image));
    },
    fetcDeleteImage: imageId => {
      dispatch(deleteImageById(imageId));
    },
    fetchAddEquipment: equipment => {
      dispatch(addEquipment(equipment));
    }
  })
)
class AddImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      descriptionImages: [],
      imageUrl: [],
      progress: [],
      index: 0
    };
  }

  _showAlert = (title, msg) => {
    Alert.alert(title, msg, [{ text: "OK" }], {
      cancelable: true
    });
  };

  _handleAddImage = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === "granted") {
      let result = await ImagePicker.launchImageLibraryAsync();
      if (!result.cancelled) {
        this.setState({
          images: [...this.state.images, result.uri]
        });
        // const form = new FormData();
        // form.append("image", {
        //   uri: result.uri,
        //   type: "image/jpg",
        //   name: "image.jpg"
        // });

        // const res = await axios.post(`storage/equipmentImages`, form, {
        //   headers: { "Content-Type": "multipart/form-data" },
        //   onUploadProgress: progressEvent => {
        //     console.log(
        //       "Upload progress: " +
        //         Math.round((progressEvent.loaded / progressEvent.total) * 100) +
        //         "%"
        //     );
        //     const { progress, index, processing } = this.state;
        //     progress[index] = Math.round(
        //       (progressEvent.loaded / progressEvent.total) * 100
        //     );
        //     this.setState({
        //       progress
        //     });
        //   }
        // });
        // this.setState({
        //   imageUrl: [...this.state.imageUrl, res.data[0]],
        //   index: index + 1
        // });
      }
    }
  };

  _handleAddEquipment = async () => {
    const { descriptionImages, imageUrl, lat, long, images } = this.state;
    const { data } = this.props.navigation.state.params;
    const form = new FormData();
    images.map((item, i) => {
      form.append("image", {
        uri: item.uri,
        type: "image/jpg",
        name: "image.jpg"
      });
    });
    const res = await axios.post(`storage/equipmentImages`, form, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: progressEvent => {
        console.log(
          "Upload progress: " +
            Math.round((progressEvent.loaded / progressEvent.total) * 100) +
            "%"
        );
        const { progress, index, processing } = this.state;
        progress[index] = Math.round(
          (progressEvent.loaded / progressEvent.total) * 100
        );
        this.setState({
          progress
        });
      }
    });
    const image = {
      equipmentImages: imageUrl.map(item => {
        return {
          id: item.id
        };
      }),
      thumbnailImage: {
        id: imageUrl[0].id
      }
    };
    const newEquipment = Object.assign({}, data, image);
    this.props.fetchAddEquipment(newEquipment);
  };

  _handleSubmit = async () => {
    const { loading } = this.props;
    if (!loading && this.state.images.length > 0) {
      this._handleAddEquipment();
      this.props.navigation.dismiss();
    } else {
      this._showAlert("Warning", "You have to upload images before submit");
    }
  };

  _handleRemove = rowIndex => {
    this.setState({
      progress: this.state.progress.filter((item, index) => index !== rowIndex),
      imageUrl: this.state.imageUrl.filter((item, index) => index !== rowIndex),
      images: this.state.images.filter((item, index) => index !== rowIndex)
    });
    console.log(this.state.imageUrl, this.state.progress);
  };

  _renderImageUpdate = (image, key) => {
    return (
      <View key={key}>
        <Image
          source={{ uri: image }}
          style={styles.landscapeImg}
          resizeMode={"cover"}
        />
        {this.state.progress[key] < 100 ? (
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: "rgba(0,0,0,0.3)",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Loading />
          </View>
        ) : (
          <TouchableOpacity
            style={{
              ...StyleSheet.absoluteFillObject,
              justifyContent: "flex-end",
              alignItems: "flex-end"
            }}
            onPress={() => this._handleRemove(key)}
          >
            <Text>Delete</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  _renderRowImageUpdate = (image, key) => {
    return (
      <View key={key} style={{ marginTop: 10, marginRight: 10 }}>
        <Image
          source={{ uri: image }}
          style={styles.smallImage}
          resizeMode={"cover"}
        />
        {this.state.progress[key] < 100 ? (
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: "rgba(0,0,0,0.3)",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Loading />
          </View>
        ) : (
          <TouchableOpacity
            style={{
              ...StyleSheet.absoluteFillObject,
              justifyContent: "flex-end",
              alignItems: "flex-end"
            }}
            onPress={() => this._handleRemove(key)}
          >
            <Text>Delete</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  render() {
    const { data } = this.props.navigation.state.params;
    const { loading } = this.props;
    const { images } = this.state;
    console.log(this.state.imageUrl, this.state.progress);
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "always", top: "always" }}
      >
        <Header
          renderLeftButton={() => (
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Feather name="arrow-left" size={24} />
            </TouchableOpacity>
          )}
        >
          <Text
            style={{
              fontSize: fontSize.h4,
              fontWeight: "500",
              color: colors.text
            }}
          >
            Upload images
          </Text>
        </Header>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 15 }}
        >
          {images.length > 0 ? (
            <View>
              {this._renderImageUpdate(images[0], 0)}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  flexWrap: "wrap"
                }}
              >
                {images
                  .slice(1)
                  .map((item, index) =>
                    this._renderRowImageUpdate(item, index + 1)
                  )}
              </View>
            </View>
          ) : null}
          {}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <Button
              buttonStyle={styles.buttonStyle}
              text={"Add Image"}
              onPress={() => this._handleAddImage()}
            />
          </View>
          <TouchableOpacity
            style={styles.buttonEnable}
            onPress={() => this._handleSubmit()}
          >
            <Text style={styles.textEnable}>Submit</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  landscapeImg: {
    height: 200
  },
  smallImage: {
    height: 50,
    width: 80
  },
  buttonWrapper: {
    marginRight: 15,
    width: 80,
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row"
  },
  buttonEnable: {
    marginTop: 20,
    marginHorizontal: 15,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryColor
  },
  textEnable: {
    fontSize: fontSize.bodyText,
    fontWeight: "500",
    color: "white"
  }
});

export default AddImage;
