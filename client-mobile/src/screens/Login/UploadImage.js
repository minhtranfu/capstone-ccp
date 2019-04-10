import React, { Component } from "react";
import { SafeAreaView } from "react-navigation";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert
} from "react-native";
import { Image } from "react-native-expo-image-cache";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { register } from "../../redux/actions/auth";
import axios from "axios";
import { ImagePicker, Permissions } from "expo";

import Header from "../../components/Header";
import Loading from "../../components/Loading";
import InputField from "../../components/InputField";
import Button from "../../components/Button";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";
import Feather from "@expo/vector-icons/Feather";

@connect(
  state => ({}),
  dispatch => bindActionCreators({ fetchRegister: register }, dispatch)
)
class UploadImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: "",
      submitLoading: null,
      progress: 0
    };
  }

  _handleAddImage = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === "granted") {
      let result = await ImagePicker.launchImageLibraryAsync();
      if (!result.cancelled) {
        this.setState({
          image: result.uri
        });
        const form = new FormData();
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
          this.setState({ image: res.data[0].url, progress: 0 });
        }
      }
    }
  };

  _handleSubmit = () => {
    const { image } = this.state;
    const { user } = this.props.navigation.state.params;
    this.props.fetchRegister({
      ...user,
      contractor: {
        ...user.contractor,
        thumbnailImageUrl: image
      }
    });
    this.props.navigation.goBack();
  };

  render() {
    const { image, progress } = this.state;
    return (
      <SafeAreaView style={styles.container} forceInset={{ top: "always" }}>
        <Header
          renderLeftButton={() => (
            <TouchableOpacity onPress={() => this.props.navigation.goback()}>
              <Feather name={"chevron-left"} size={24} />
            </TouchableOpacity>
          )}
        />
        <ScrollView contentContainerStyle={{ paddingHorizontal: 15 }}>
          <Text>Almost done</Text>
          <View>
            <Image
              uri={image}
              resizeMode={"cover"}
              style={{ height: 80, width: 80, borderRadius: 40 }}
            />
            {progress !== 0 ? (
              <View
                style={{
                  position: "absolute",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Loading />
              </View>
            ) : null}
          </View>
          <TouchableOpacity onPress={this._handleAddImage}>
            <Text>Upload your profile image</Text>
          </TouchableOpacity>
        </ScrollView>
        <SafeAreaView>
          <Button text={"Submit"} onPress={this._handleSubmit} />
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

export default UploadImage;
