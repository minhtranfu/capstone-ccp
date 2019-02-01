import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { ImagePicker, Permissions } from "expo";
import { SafeAreaView, NavigationActions } from "react-navigation";
import { connect } from "react-redux";
import { addNewEquipment } from "../../../redux/actions/equipment";

import Header from "../../../components/Header";
import Button from "../../../components/Button";

@connect(
  state => ({
    equipment: state.equipment.equipment
  }),
  dispatch => ({
    addEquipment: data => dispatch(addNewEquipment(data))
  })
)
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

  handleAddNewEquipment = () => {
    const { descriptionImages, thumbnailImage } = this.state;
    const { data } = this.props.navigation.state.params;
    const contractor = {
      constructionId: 1,
      descriptionImages: descriptionImages,
      constractor: {
        id: 1
      },
      thumbnailImage: [thumbnailImage],
      address: "340 Nguyen Tat Thanh"
    };
    const newData = Object.assign({}, data, contractor);
    console.log("Submit", newData);
    this.props.addEquipment(newData);
  };

  render() {
    const { data } = this.props.navigation.state.params;
    console.log(data);
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
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.dismiss();
            this.handleAddNewEquipment();
          }}
        >
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
