import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image as RNImage,
  Alert,
  FlatList
} from "react-native";
import { Image } from "react-native-expo-image-cache";
import { SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  getEquipmentImage,
  deleteEquipmentImage,
  insertImageToEquipmentList,
  resetEquipmentImage
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
        fetchInsertImage: insertImageToEquipmentList,
        fetchResetEquipmentImage: resetEquipmentImage
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

  static getDerivedStateFromProps(nextProps, prevState) {
    //Check data is update
    if (nextProps.imageList !== prevState.images) {
      return {
        images: nextProps.imageList
      };
    }
    return null;
  }

  _handleAddImage = async () => {
    const { id } = this.props.navigation.state.params;
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === "granted") {
      let result = await ImagePicker.launchImageLibraryAsync();
      if (!result.cancelled) {
        // this.setState({ images: [...this.state.images, result.uri] });
        const form = new FormData();
        this.setState({ submitLoading: true });
        form.append("image", {
          uri: result.uri,
          type: "image/jpg",
          name: "image.jpg"
        });
        const res = await axios.post(`storage/equipmentImages`, form, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: progressEvent => {
            console.log(
              "Upload progress: " +
                Math.round((progressEvent.loaded / progressEvent.total) * 100) +
                "%"
            );
            this.setState({
              progress: Math.round(
                (progressEvent.loaded / progressEvent.total) * 100
              )
            });
          }
        });
        if (res) {
          const newImage = res.data.map(item => ({ id: item.id }));
          await this.props.fetchInsertImage(id, newImage);
          this.setState({ images: [...this.state.images, res.data[0]] });
        }
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

  _formatData = () => {
    const { imageList } = this.props;
    if (imageList.length % 2 === 1) {
      imageList.push({ id: "blank", url: null });
    }
    return imageList;
  };

  _renderItem = ({ item, index }) => {
    return (
      <View
        style={{ flex: 1, height: 120, marginRight: index % 2 === 0 ? 15 : 0 }}
      >
        <Image
          key={item.id}
          uri={item.url}
          resizeMode={"cover"}
          style={{ flex: 1, height: 120 }}
        />
        {item.id === "blank" ? null : (
          <TouchableOpacity
            style={styles.iconDelete}
            onPress={() => this.props.fetchDeteleEquipmentImage(id, item.id)}
          >
            <Feather name={"x"} size={20} color={colors.secondaryColor} />
          </TouchableOpacity>
        )}
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
            <FlatList
              style={{ flex: 1 }}
              contentContainerStyle={{
                paddingHorizontal: 15,
                paddingVertical: 5
              }}
              data={this._formatData(imageList)}
              renderItem={this._renderItem}
              numColumns={2}
              ListEmptyComponent={() => <Text>No data</Text>}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              keyExtractor={(item, index) => index.toString()}
            />
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
