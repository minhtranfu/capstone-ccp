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
import { Feather } from "@expo/vector-icons";
import { connect } from "react-redux";
import { Location } from "expo";
import { grantPermission } from "../../../redux/reducers/permission";
import { addEquipment } from "../../../redux/actions/equipment";
import { getAddressByLatLong } from "../../../redux/actions/location";

import Header from "../../../components/Header";
import Button from "../../../components/Button";

import colors from "../../../config/colors";
import fontSize from "../../../config/fontSize";

@connect(
  state => ({
    equipment: state.equipment.equipment
  }),
  dispatch => ({
    addEquipment: data => dispatch(addEquipment(data))
  })
)
class AddImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      thumbnailImage: "",
      descriptionImages: [],
      long: "",
      lat: "",
      address: ""
    };
  }

  componentDidMount = async () => {
    const locationStatus = await grantPermission("location");
    if (locationStatus === "granted") {
      const currentLocation = await Location.getCurrentPositionAsync({});
      const coords = currentLocation.coords;
      const lat = coords.latitude;
      const long = coords.longitude;
      this.setState({
        lat: lat,
        long: long,
        address: await getAddressByLatLong(lat, long)
      });
    }
  };

  _handleOnPressThumbnailImage = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    if (status === "granted") {
      let result = await ImagePicker.launchImageLibraryAsync();
      if (!result.cancelled) {
        this.setState({ thumbnailImage: result.uri });
      }
    }
  };

  _handleOnPressDescriptionImage = async () => {
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

  _handleOnPressAddEquipment = () => {
    const {
      descriptionImages,
      thumbnailImage,
      address,
      lat,
      long
    } = this.state;
    const { data } = this.props.navigation.state.params;
    const contractor = {
      constructionId: null,
      descriptionImages: descriptionImages,
      constractor: {
        id: 13
      },
      thumbnailImage: [thumbnailImage],
      address: address,
      latitude: lat,
      longitute: long
    };
    const newData = Object.assign({}, data, contractor);
    console.log("Submit", newData);
    this.props.addEquipment(newData);
  };

  render() {
    const { data } = this.props.navigation.state.params;
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
          <Button
            buttonStyle={styles.buttonStyle}
            text={"Add Thumbnail Image"}
            onPress={this._handleOnPressThumbnailImage}
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
            onPress={this._handleOnPressDescriptionImage}
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
              this._handleOnPressAddEquipment();
              this.props.navigation.dismiss();
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
    position: "absolute",
    bottom: 30,
    right: 15,
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
    color: "white"
  }
});

export default AddImage;
