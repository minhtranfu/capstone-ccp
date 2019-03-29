import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  Image
} from "react-native";
//import { Image } from "react-native-expo-image-cache";
import { connect } from "react-redux";
import { SafeAreaView } from "react-navigation";
import Feather from "@expo/vector-icons/Feather";
import {
  createNewArticle,
  getAllDebrisServiceTypes,
  removeTypeServices,
  clearTypeServices
} from "../../redux/actions/debris";
import { autoCompleteSearch } from "../../redux/actions/location";
import { ImagePicker, Permissions } from "expo";
import axios from "axios";

import Title from "../../components/Title";
import AutoComplete from "../../components/AutoComplete";
import InputField from "../../components/InputField";
import Dropdown from "../../components/Dropdown";
import Header from "../../components/Header";
import Loading from "../../components/Loading";
import Button from "../../components/Button";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

const { width, height } = Dimensions.get("window");

@connect(
  state => ({
    types: state.debris.debrisTypes,
    loading: state.debris.loading,
    typeServices: state.debris.typeServices
  }),
  dispatch => ({
    fetchGetDebrisType: () => {
      dispatch(getAllDebrisServiceTypes());
    },
    fetchCreateNewArticle: article => {
      dispatch(createNewArticle(article));
    },
    fetchRemoveTypeServices: id => {
      dispatch(removeTypeServices(id));
    },
    fetchClearTypeServices: () => {
      dispatch(clearTypeServices());
    }
  })
)
class AddDebrisPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: "",
      title: "",
      servicesType: [],
      lat: null,
      lng: null,
      images: [],
      imageIndex: 0
    };
  }

  componentWillUnmount() {
    this.props.fetchClearTypeServices();
  }

  _showAlert = msg => {
    Alert.alert("Error", msg, [{ text: "OK" }], {
      cancelable: true
    });
  };

  _renderAutoCompleteItem = item => (
    <TouchableOpacity
      style={styles.autocompleteWrapper}
      onPress={() => {
        this.setState({
          address: item.main_text + ", " + item.secondary_text,
          lat: item.lat,
          lng: item.lng,
          hideResults: true
        });
      }}
    >
      <Text style={styles.addressMainText}>{item.main_text}</Text>
      <Text style={styles.caption}>{item.secondary_text}</Text>
    </TouchableOpacity>
  );

  _handleAddImage = async () => {
    const { status } = await Permissions.getAsync(Permissions.CAMERA_ROLL);
    if (status === "granted") {
      let result = await ImagePicker.launchImageLibraryAsync();
      if (!result.cancelled) {
        this.setState({
          images: [...this.state.images, result.uri]
        });
      }
    }
  };

  _handleAddressChange = async address => {
    this.setState({
      location: await autoCompleteSearch(address, null, null)
    });
  };

  _renderRowImageUpdate = (image, key, imageIndex) => {
    return (
      <TouchableOpacity
        key={key}
        style={[
          { marginVertical: 10, marginRight: 10 },
          imageIndex === key
            ? {
                borderWidth: 1,
                borderColor: colors.secondaryColor,
                borderRadius: 10
              }
            : null
        ]}
        onPress={() => this.setState({ imageIndex: key })}
      >
        <Image
          source={{ uri: image }}
          style={styles.smallImage}
          resizeMode={"cover"}
        />

        <TouchableOpacity
          style={styles.iconDelete}
          onPress={() => this._handleRemove(key)}
        >
          <Feather name={"x"} size={20} color={colors.secondaryColor} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  _handleRemove = rowIndex => {
    this.setState({
      images: this.state.images.filter((item, index) => index !== rowIndex)
    });
  };

  _handleSubmit = async () => {
    const { address, title, lat, lng, images } = this.state;
    const { typeServices } = this.props;
    this.setState({ submitLoading: true });
    const form = new FormData();
    images.map((item, i) => {
      form.append("image", {
        uri: item,
        type: "image/png",
        name: "image.png"
      });
    });
    try {
      const res = await axios.post(`storage/debrisImages`, form, {
        headers: { "Content-Type": "multipart/form-data" }
      });
    } catch (error) {
      this.setState({ submitLoading: false });
      this._showAlert(error);
    }
    const image = {
      debrisImages: res.data.map(item => {
        return {
          id: item.id
        };
      }),
      thumbnailImage: {
        id: res.data[0].id
      }
    };
    const article = {
      title,
      address,
      latitude: 10.001,
      longitude: 106.121313,
      debrisServiceTypes: typeServices.map(item => {
        return { id: item.id };
      }),
      ...image
    };
    if (typeServices && typeServices.length < 1) {
      this._showAlert("You must add services");
    } else {
      this.props.fetchCreateNewArticle(article);
      this.props.navigation.goBack();
    }
  };

  _renderContent = () => {
    const { title, address, images, imageIndex } = this.state;
    const { typeServices } = this.props;
    return (
      <View>
        <InputField
          label={"Title"}
          placeholder={"Input your title"}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          onChangeText={value => this.setState({ title: value })}
          value={title}
          returnKeyType={"next"}
        />
        <AutoComplete
          label={"Address"}
          placeholder={"Input your address"}
          onFocus={() => this.setState({ hideResults: false })}
          hideResults={this.state.hideResults}
          data={location}
          value={address}
          onChangeText={value => {
            this.setState({ address: value });
            this._handleAddressChange(value);
          }}
          renderItem={item => this._renderAutoCompleteItem(item)}
        />
        <Text style={styles.text}>Debris services types</Text>
        <View>
          {typeServices !== undefined && typeServices.length > 0
            ? typeServices.map(item => (
                <View style={styles.rowTypeWrapper} key={item.id}>
                  <Text style={styles.text}>{item.name}</Text>
                  <TouchableOpacity
                    onPress={() => this.props.fetchRemoveTypeServices(item.id)}
                  >
                    <Text style={styles.text}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ))
            : null}
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={() => this.props.navigation.navigate("AddServicesTypes")}
          >
            <Feather name="plus-circle" size={20} />
            <Text style={styles.text}>Add types</Text>
          </TouchableOpacity>
        </View>
        <Title text={"Insert your image"} />
        {images.length > 0 ? (
          <View style={{ flex: 1 }}>
            <Image
              source={{ uri: images[imageIndex] }}
              style={styles.landscapeImg}
              resizeMode={"cover"}
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                flexWrap: "wrap"
              }}
            >
              {images.map((item, index) =>
                this._renderRowImageUpdate(item, index, imageIndex)
              )}
            </View>
          </View>
        ) : null}
        <Button
          text={"Add Image"}
          onPress={this._handleAddImage}
          wrapperStyle={{ marginBottom: 15 }}
        />
        <Button text={"Submit"} onPress={this._handleSubmit} />
      </View>
    );
  };

  render() {
    const { navigation, loading } = this.props;
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "always", top: "always" }}
      >
        <Header
          renderLeftButton={() => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather name="x" size={24} />
            </TouchableOpacity>
          )}
        >
          <Text style={styles.text}>Add new article</Text>
        </Header>
        {this.state.submitLoading ? (
          <View
            style={{
              position: "absolute",
              backgroundColor: "white",
              width: width,
              height: height
            }}
          >
            <Loading />
          </View>
        ) : null}
        <ScrollView contentContainerStyle={{ paddingHorizontal: 15 }}>
          {this._renderContent()}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  rowTypeWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  text: {
    fontSize: fontSize.bodyText,
    fontWeight: "500"
  },
  landscapeImg: {
    height: 200
  },
  smallImage: {
    height: 100,
    width: width / 4,
    borderRadius: 10
  }
});

export default AddDebrisPost;
