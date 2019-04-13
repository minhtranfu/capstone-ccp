import React, { Component } from "react";
import { SafeAreaView } from "react-navigation";
import axios from "axios";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActionSheetIOS
} from "react-native";
import { ImagePicker, Permissions } from "expo";

import CameraView from "./components/Camera";
import Button from "../../components/Button";
import Header from "../../components/Header";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

class VerifyAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: null,
      modalVisible: false,
      loading: false
    };
  }

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

  _handleChangeImage = image => {
    this.setState({ images: [...this.state.images, image] });
  };

  _handleAddImage = async () => {
    const { contractor } = this.props;
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === "granted") {
      let result = await ImagePicker.launchImageLibraryAsync();
      if (!result.cancelled) {
        this.setState({ images: [...this.state.images, result.uri] });
      }
    }
  };

  _submitImage = async () => {
    this.setState({ loading: true });
    const form = new FormData();
    images.map((item, i) => {
      form.append("image", {
        uri: item,
        type: "image/png",
        name: "image.png"
      });
    });
    try {
      const res = await axios.post(`storage/contractorVerifyingImages`, form, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      this.props.navigation.goBack();
    } catch (error) {
      this.setState({ loading: false });
      this.props.navigation.goBack();
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
          <Header
            renderLeftButton={() => (
              <TouchableOpacity onPress={() => this._setModalVisible(false)}>
                <Feather name="x" size={24} />
              </TouchableOpacity>
            )}
          />
          <CameraView onSelectImage={value => this._handleChangeImage(value)} />
        </SafeAreaView>
      </Modal>
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.container} forceInset={{ top: "always" }}>
        <Header
          renderLeftButton={() => (
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Text>Goback</Text>
            </TouchableOpacity>
          )}
          renderRightButton={() => (
            <TouchableOpacity onPress={this._showActionSheet}>
              <Text>Add image</Text>
            </TouchableOpacity>
          )}
        >
          <Text>Upload your image</Text>
        </Header>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 15 }} />
        <SafeAreaView>
          <Button text={"Submit"} onPress={this._submitImage} />
        </SafeAreaView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default VerifyAccount;
