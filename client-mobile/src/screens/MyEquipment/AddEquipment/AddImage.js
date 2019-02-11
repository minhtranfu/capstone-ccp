import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView
} from "react-native";
import { ImagePicker, Permissions } from "expo";
import { SafeAreaView, NavigationActions } from "react-navigation";
import { connect } from "react-redux";
import { addNewEquipment } from "../../../redux/actions/equipment";
import { Feather } from "@expo/vector-icons";

import Header from "../../../components/Header";
import Button from "../../../components/Button";

import colors from "../../../config/colors";
import fontSize from "../../../config/fontSize";

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
      address: "340 Nguyễn Tất Thành, Quận 4, Hồ Chí Minh, Việt Nam",
      status: "available"
    };
    const newData = Object.assign({}, data, contractor);
    console.log("Submit", newData);
    this.props.addEquipment(newData);
  };

  render() {
    const { data } = this.props.navigation.state.params;
    console.log(data);
    return (
      <SafeAreaView style={styles.container}>
        <Header
          renderLeftButton={() => (
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Feather name="arrow-left" size={24} />
            </TouchableOpacity>
          )}
        >
          <Text style={{ fontSize: fontSize.h4, fontWeight: "500", color: colors.text }}>
            Upload images
          </Text>
        </Header>
        <ScrollView style={{flex: 1}} contentContainerStyle={{paddingHorizontal: 15}}>
          <Button
            buttonStyle={styles.buttonStyle}
            text={"Add Thumbnail Image"}
            onPress={this.handleAddThumbnailImage}
          />
          <Image
            source={{ uri: this.state.thumbnailImage || "" }}
            style={styles.landscapeImg}
            resizeMode={"cover"}
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
        </ScrollView>
        <View style={styles.bottomWrapper}>
          <TouchableOpacity
            style={[styles.buttonWrapper, styles.buttonEnable]}
            onPress={() => {
              this.props.navigation.dismiss();
              this.handleAddNewEquipment();
            }}
          >
            <Text style={styles.textEnable}>Submit</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  landscapeImg: {
    marginHorizontal: 15,
    height: 200
  },
  bottomWrapper: {
    backgroundColor: "transparent",
    zIndex: 1,
    justifyContent: "center",
    alignItems: "flex-end"
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
    backgroundColor: colors.primaryColor
  },
  textEnable: {
    fontSize: fontSize.bodyText,
    fontWeight: "500",
    color: 'white',
  },
});

export default AddImage;
