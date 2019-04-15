import React from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "react-native-expo-image-cache";
import { Camera, Permissions } from "expo";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import fontSize from "../../../config/fontSize";
import colors from "../../../config/colors";

class CameraView extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    capturedPhoto: null
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  }

  snap = async () => {
    if (this.camera) {
      let photo = await this.camera.takePictureAsync();
      this.setState({ capturedPhoto: photo.uri });
    }
  };

  render() {
    const { hasCameraPermission, capturedPhoto } = this.state;
    const { onPressBack, onSelectedPhoto } = this.props;
    console.log("permission", capturedPhoto);
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          {capturedPhoto ? (
            <View style={{ flex: 1, backgroundColor: "transparent" }}>
              <Image
                uri={capturedPhoto}
                resizeMode={"cover"}
                style={{ flex: 1 }}
              />
              <View
                style={{
                  backgroundColor: "black",
                  height: 40,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingHorizontal: 15
                }}
              >
                <TouchableOpacity
                  onPress={() => this.setState({ capturedPhoto: null })}
                >
                  <Text style={styles.text}>Retake</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onSelectedPhoto(this.state.capturedPhoto)}
                >
                  <Text style={styles.text}>Use photo</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <Camera
              style={{ flex: 1 }}
              type={this.state.type}
              autoFocus={"on"}
              ref={ref => {
                this.camera = ref;
              }}
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor: "transparent",
                  flexDirection: "row",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  marginHorizontal: 15
                }}
              >
                <TouchableOpacity
                  onPress={onPressBack}
                  style={{ alignItems: "center" }}
                >
                  <Text style={[styles.text, { marginBottom: 20 }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.snap}>
                  <MaterialCommunityIcons
                    name="circle-slice-8"
                    size={55}
                    color={"white"}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      type:
                        this.state.type === Camera.Constants.Type.back
                          ? Camera.Constants.Type.front
                          : Camera.Constants.Type.back
                    });
                  }}
                >
                  <Ionicons
                    name="ios-reverse-camera"
                    size={40}
                    color={"white"}
                  />
                </TouchableOpacity>
              </View>
            </Camera>
          )}
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  text: {
    fontSize: fontSize.bodyText,
    color: "white",
    fontWeight: "500"
  }
});

export default CameraView;
