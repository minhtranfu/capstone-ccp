import React from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "react-native-expo-image-cache";
import { Camera, Permissions } from "expo";

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
    console.log("permission", capturedPhoto);
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          {capturedPhoto ? (
            <Image
              uri={capturedPhoto}
              resizeMode={"cover"}
              style={{ flex: 1 }}
            />
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
                  flexDirection: "row"
                }}
              >
                <TouchableOpacity
                  style={{
                    flex: 0.1,
                    alignSelf: "flex-end",
                    alignItems: "center"
                  }}
                  onPress={() => {
                    this.setState({
                      type:
                        this.state.type === Camera.Constants.Type.back
                          ? Camera.Constants.Type.front
                          : Camera.Constants.Type.back
                    });
                  }}
                >
                  <Text
                    style={{ fontSize: 18, marginBottom: 10, color: "white" }}
                  >
                    {" "}
                    Flip{" "}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.snap}>
                  <Text>Take a picture</Text>
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
  }
});

export default CameraView;
