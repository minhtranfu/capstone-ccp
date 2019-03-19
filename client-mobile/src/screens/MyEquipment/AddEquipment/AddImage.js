import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert
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
      imageUrl: []
    };
  }

  _handleAddImage = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    if (status === "granted") {
      let result = await ImagePicker.launchImageLibraryAsync();
      if (!result.cancelled) {
        this.setState({
          images: [...this.state.images, result.uri]
        });
        const form = new FormData();
        form.append("image", {
          uri: result.uri,
          type: "image/jpg",
          name: "image.jpg"
        });

        // await this.props.fetchUploadImage(form);
        const res = await axios.post(`equipmentImages`, form, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: progressEvent => {
            console.log(
              "Upload progress: " +
                Math.round((progressEvent.loaded / progressEvent.total) * 100) +
                "%"
            );
          }
        });
        console.log(res);
        this.setState({ imageUrl: [...this.state.imageUrl, res.data[0]] });
        console.log(this.state.imageUrl);
      }
    }
  };

  // _handleUploadImage = () => {
  //   //   const form = new FormData();
  //   //   this.state.images.map((item, i) => {
  //   //     form.append("image", {
  //   //       uri: item.uri,
  //   //       type: "image/jpg",
  //   //       name: "image.jpg"
  //   //     });
  //   //   });

  //   //   this.props.fetchUploadImage(form);
  //   const form = new FormData();
  //   form.append("image", {
  //     uri: result.uri,
  //     type: "image/jpg",
  //     name: "image.jpg"
  //   });

  //   axios
  //     .post(`equipmentImages`, form, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //       onUploadProgress: progressEvent => {
  //         console.log(
  //           "Upload progress: " +
  //             Math.round((progressEvent.loaded / progressEvent.total) * 100) +
  //             "%"
  //         );
  //       }
  //     })
  //     .then(res => console.log(res));
  // };

  _handleAddEquipment = () => {
    const { descriptionImages, imageUrl, lat, long } = this.state;
    // const { imageUrl } = this.props;
    const { data } = this.props.navigation.state.params;
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

  _showAlert = (title, msg) => {
    Alert.alert(title, msg, [{ text: "OK" }], {
      cancelable: true
    });
  };

  _handleSubmit = () => {
    const { loading } = this.props;
    if (!loading && this.state.imageUrl.length > 0) {
      this._handleAddEquipment();
      this.props.navigation.dismiss();
    } else {
      this._showAlert("Warning", "You have to upload images before submit");
    }
  };

  render() {
    const { data } = this.props.navigation.state.params;
    const { loading } = this.props;
    const { images } = this.state;
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
              <Image
                source={{ uri: images[0] }}
                style={styles.landscapeImg}
                resizeMode={"cover"}
              />
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  flexWrap: "wrap"
                }}
              >
                {images.slice(1).map((item, index) => (
                  <Image
                    key={index}
                    source={{ uri: item }}
                    style={styles.smallImage}
                    resizeMode={"cover"}
                  />
                ))}
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
    marginTop: 10,
    marginRight: 10,
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
