import React, { Component } from "react";
import PropTypes from "prop-types";
import { Image } from "react-native-expo-image-cache";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
  ActionSheetIOS,
  Modal,
  StatusBar
} from "react-native";
import { connect } from "react-redux";
import { SafeAreaView } from "react-navigation";
import { Feather } from "@expo/vector-icons";
import {
  getContractorDetail,
  updateContractorDetail
} from "../../redux/actions/contractor";
import { ImagePicker, Permissions } from "expo";
import axios from "axios";

import CameraView from "./components/Camera";
import Button from "../../components/Button";
import Loading from "../../components/Loading";
import Header from "../../components/Header";
import InputField from "../../components/InputField";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";
import ParallaxList from "../../components/ParallaxList";

@connect(
  state => ({
    contractor: state.contractor.detail
  }),
  dispatch => ({
    fetchGetContractorDetail: id => {
      dispatch(getContractorDetail(id));
    },
    fetchUpdateContractorDetail: (id, contractor) => {
      dispatch(updateContractorDetail(id, contractor));
    }
  })
)
class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      phone: "",
      thumbnailImage: "",
      data: {},
      dataChanged: false,
      clicked: null,
      image: null,
      progress: 0,
      modalVisible: false
    };
  }

  componentDidMount() {
    const { contractorId } = this.props.navigation.state.params;
    this.props.fetchGetContractorDetail(contractorId);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    //Check data is update
    if (
      Object.keys(prevState.data).length === 0 &&
      nextProps.contractor !== prevState.data
    ) {
      return {
        data: nextProps.contractor
      };
    }
    return null;
  }

  _handleInputChange = (field, value) => {
    let newData = { ...this.state.data };
    newData[field] = value;
    this.setState({ data: newData, dataChanged: true });
  };

  _setModalVisible = visible => {
    this.setState({ modalVisible: visible });
  };

  _showActionSheet = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "Take photo", "Choose from your library"],
        cancelButtonIndex: 0
      },
      buttonIndex => {
        if (buttonIndex === 1) {
          this.setState({ modalVisible: true });
        } else if (buttonIndex === 2) {
          this._handleAddImage();
        }
      }
    );
  };

  _handleSave = () => {
    const { data } = this.state;
    const { contractorId } = this.props.navigation.state.params;
    try {
      this.props.fetchUpdateContractorDetail(contractorId, data);
    } catch (error) {
      this._showAlert(error);
    }
    this.props.navigation.goBack();
  };

  _showAlert = msg => {
    Alert.alert("Error", msg, [{ text: "OK" }], {
      cancelable: true
    });
  };

  _handleUploadImage = async () => {
    const { image } = this.state;
    const form = new FormData();
    this.setState({ submitLoading: true });
    form.append("image", {
      uri: image,
      type: "image/jpg",
      name: "image.jpg"
    });
    const res = await axios.post(`storage/contractorVerifyingImages`, form, {
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
      console.log(res);
      this.setState({
        data: {
          ...this.state.data,
          thumbnailImageUrl: res.data[0].url
        },
        image: null,
        progress: 0,
        dataChanged: true
      });
    }
  };

  _handleAddImage = async () => {
    const { contractor } = this.props;
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === "granted") {
      let result = await ImagePicker.launchImageLibraryAsync();
      if (!result.cancelled) {
        this.setState({ image: result.uri });
        this._handleUploadImage();
      }
    }
  };

  _handleShowCamera = () => {
    const { modalVisible } = this.state;
    return (
      <Modal animationType="slide" transparent={false} visible={modalVisible}>
        <SafeAreaView
          style={styles.containter}
          forceInset={{ bottom: "always", top: "always" }}
        >
          <CameraView
            onPressBack={() => this._setModalVisible(false)}
            onSelectedPhoto={async value => {
              await this.setState({ image: value });
              this._setModalVisible(false);
              if (this.state.image) {
                this._handleUploadImage();
              }
            }}
          />
        </SafeAreaView>
      </Modal>
    );
  };

  _renderScrollViewItem = () => {
    const { data, progress } = this.state;
    return (
      <View style={{ paddingHorizontal: 15, paddingTop: 15 }}>
        {this._handleShowCamera()}
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Image
            uri={data.thumbnailImageUrl}
            resizeMode={"cover"}
            style={{ width: 80, height: 80, borderRadius: 40 }}
          />
          {progress !== 0 ? (
            <View
              style={{
                position: "absolute",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0,0,0,0.5)"
              }}
            >
              <Loading />
            </View>
          ) : null}

          <TouchableOpacity onPress={this._showActionSheet}>
            <Text
              style={{
                fontSize: fontSize.secondaryText,
                fontWeight: "500",
                marginTop: 5
              }}
            >
              Change profile photo
            </Text>
          </TouchableOpacity>
        </View>
        <InputField
          label={"Name"}
          placeholder={"Input your equipment name"}
          placeholderTextColor={colors.text50}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          onChangeText={value => this._handleInputChange("name", value)}
          value={data.name}
          returnKeyType={"next"}
        />
        <InputField
          label={"Email"}
          placeholder={"Input your equipment name"}
          placeholderTextColor={colors.text50}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          onChangeText={value => this._handleInputChange("email", value)}
          value={data.email}
          returnKeyType={"next"}
        />
        <InputField
          label={"Phone"}
          placeholder={"Input your phone number"}
          placeholderTextColor={colors.text50}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          onChangeText={value => this._handleInputChange("phoneNumber", value)}
          value={data.phoneNumber}
          returnKeyType={"next"}
        />
      </View>
    );
  };

  _renderNextButton = () => (
    <TouchableOpacity style={styles.buttonWrapper}>
      <Text style={styles.text}>Submit</Text>
    </TouchableOpacity>
  );

  render() {
    const { contractor } = this.props;
    const { dataChanged } = this.state;
    return (
      <SafeAreaView
        forceInset={{ bottom: "never", top: "always" }}
        style={styles.containter}
      >
        {contractor ? (
          <View style={{ flex: 1, flexDirection: "column" }}>
            <ParallaxList
              title={"Edit Profile"}
              hasLeft={true}
              hasCart={false}
              scrollElement={<Animated.ScrollView />}
              renderScrollItem={this._renderScrollViewItem}
            />
            <SafeAreaView
              forceInset={{ bottom: "always" }}
              style={{
                backgroundColor: dataChanged ? colors.secondaryColor : "#a5acb8"
              }}
            >
              <Button
                text={"Save"}
                onPress={this._handleSave}
                disabled={!dataChanged}
                buttonStyle={{ backgroundColor: "transparent" }}
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
  containter: {
    flex: 1
  },
  header: {
    fontSize: fontSize.h4,
    fontWeight: "600"
  },
  text: {
    fontSize: fontSize.bodyText,
    fontWeight: "500",
    color: "white"
  }
});

export default Profile;
