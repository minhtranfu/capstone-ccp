import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { ImagePicker, Permissions } from "expo";
import { SafeAreaView } from "react-navigation";

import Header from "../../../components/Header";
import Button from "../../../components/Button";

class AddImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      thumbnailImage: "",
      descriptionImages: []
    };
  }

  handleAddThumbnailImage = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    if (status === "granted") {
      let result = await ImagePicker.launchImageLibraryAsync();
      if (!result.cancelled) {
        this.setState({ thumbnailImage: result.uri });
      }
    }
  };

  handleAddDescriptionImage = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    if (status === "granted") {
      let result = await ImagePicker.launchImageLibraryAsync();
      if (!result.cancelled) {
        this.setState({
          descriptionImages: [...this.state.descriptionImages, result.uri]
        });
      }
    }
  };

  render() {
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "never", top: "always" }}
      >
        <Header>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Text>Go Back</Text>
          </TouchableOpacity>
        </Header>
        <Image
          source={{ uri: this.state.thumbnailImage || "" }}
          style={styles.landscapeImg}
          resizeMode={"cover"}
        />
        <Button
          buttonStyle={styles.buttonStyle}
          text={"Add Thumbnail Image"}
          onPress={this.handleAddThumbnailImage}
        />
        <Text>Add another image (Optional)</Text>
        <Button
          buttonStyle={styles.buttonStyle}
          text={"Add Description Image"}
          onPress={this.handleAddDescriptionImage}
        />
        {this.state.descriptionImages.length > 0
          ? this.state.descriptionImages.map((item, index) => (
              <Image
                key={index}
                source={{ uri: item }}
                style={styles.landscapeImg}
                resizeMode={"cover"}
              />
            ))
          : null}
        <TouchableOpacity>
          <Text>Submit</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  landscapeImg: {
    width: 100,
    height: 50
  }
});

export default AddImage;
