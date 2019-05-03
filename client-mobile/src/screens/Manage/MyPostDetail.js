import React, { Component } from "react";
import { SafeAreaView } from "react-navigation";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { Image } from "react-native-expo-image-cache";
import { connect } from "react-redux";
import moment from "moment";
import {
  addTypeServices,
  removeTypeServices,
  clearTypeServices,
  editArticle
} from "../../redux/actions/debris";
import { sendRequestDebrisTransaction } from "../../redux/actions/transaction";
import Feather from "@expo/vector-icons/Feather";
import { ImagePicker, Permissions } from "expo";
import axios from "axios";

import AutoComplete from "../../components/AutoComplete";
import Button from "../../components/Button";
import Header from "../../components/Header";
import InputField from "../../components/InputField";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";
import Title from "../../components/Title";

const Bid = ({ bid, onPress, onPressContractor }) => {
  const { createdTime, description, price, status, supplier } = bid;
  return (
    <View
      style={{
        paddingBottom: 5,
        paddingTop: 15,
        ...colors.shadow,
        backgroundColor: "white",
        paddingHorizontal: 15,
        borderRadius: 10,
        marginBottom: 15,
        marginTop: 5
      }}
    >
      <TouchableOpacity
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}
        onPress={onPressContractor}
      >
        <View style={{ flex: 1, marginRight: 8 }}>
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
            <Image
              uri={supplier.thumbnailImageUrl}
              style={{ width: 50, height: 50, borderRadius: 25 }}
              resizeMode={"cover"}
            />
            <View style={{ paddingLeft: 10 }}>
              <Text style={styles.bidSupplierName}>{supplier.name}</Text>
              <Text style={styles.bidTime}>
                {moment(createdTime).fromNow()}
              </Text>
            </View>
          </View>
        </View>
        <Text style={styles.bidPrice}>{`${price}k VND`}</Text>
      </TouchableOpacity>
      <Text style={styles.bidDescription}>{description}</Text>
      <TouchableOpacity
        onPress={onPress}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.text50,
          padding: 10
        }}
      >
        <View
          style={{
            flexDirection: "row",
            borderWidth: 1,
            borderColor: colors.text25,
            padding: 8,
            borderRadius: 5
          }}
        >
          <Feather name={"thumbs-up"} size={16} color={"green"} />
          <Text
            style={{
              marginLeft: 3,
              color: colors.text,
              fontSize: fontSize.secondaryText,
              fontWeight: "500"
            }}
          >
            Accept
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

@connect(
  (state, ownProps) => {
    const { id } = ownProps.navigation.state.params;
    return {
      postDetail: state.debris.debrisArticles.find(item => item.id === id),
      typeServices: state.debris.typeServices
    };
  },
  dispatch => ({
    addTypeServices: data => dispatch(addTypeServices(data)),
    fetchRemoveTypeServices: id => {
      dispatch(removeTypeServices(id));
    },
    fetchClearTypeServices: () => {
      dispatch(clearTypeServices());
    },
    fetchEditArticle: (articleId, article) => {
      dispatch(editArticle(articleId, article));
    },
    fetchAcceptRequest: debris => {
      dispatch(sendRequestDebrisTransaction(debris));
    }
  })
)
class MyPostDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      postDetail: {},
      title: "",
      address: "",
      lat: null,
      lng: null,
      hideResults: false,
      location: {},
      debrisServiceTypes: [],
      images: [],
      imageIndex: 0
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    //Check data is update
    if (
      Object.keys(prevState.postDetail).length === 0 &&
      nextProps.postDetail !== prevState.postDetail
    ) {
      return {
        postDetail: nextProps.postDetail
      };
    }
    return null;
  }

  componentDidMount() {
    this.props.addTypeServices(this.props.postDetail.debrisServiceTypes);
  }

  componentWillUnmount() {
    this.props.fetchClearTypeServices();
  }

  _capitalizeLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  _handleInputChanged = (field, value) => {
    this.setState({
      postDetail: {
        ...this.state.postDetail,
        [field]: value
      }
    });
  };

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

  _handleSubmitEdit = () => {
    const { postDetail } = this.state;
    const { typeServices } = this.props;
    const article = {
      title: postDetail.title,
      address: postDetail.address,
      latitude: 10.001,
      longitude: 106.121313,
      debrisServiceTypes: typeServices.map(item => {
        return { id: item.id };
      })
    };
    this.props.fetchEditArticle(postDetail.id, article);
    this.props.navigation.goBack();
  };

  _handleAcceptRequest = async bidId => {
    const { postDetail } = this.state;
    const request = {
      debrisPost: {
        id: postDetail.id
      },
      debrisBid: {
        id: bidId
      }
    };
    await this.props.fetchAcceptRequest(request);
    this.props.navigation.goBack();
  };

  _handleRemove = rowIndex => {
    this.setState({
      images: this.state.images.filter((item, index) => index !== rowIndex)
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
        <Image uri={image} style={styles.smallImage} resizeMode={"cover"} />

        <TouchableOpacity
          style={styles.iconDelete}
          onPress={() => this._handleRemove(key)}
        >
          <Feather name={"x"} size={20} color={colors.secondaryColor} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
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

  _renderContent = () => {
    const {
      postDetail,
      editMode,
      hideResults,
      location,
      images,
      imageIndex
    } = this.state;
    const bids = postDetail.debrisBids;
    console.log(postDetail);
    const { typeServices } = this.props;
    return (
      <View>
        <Title title={"Information"} />
        <Image
          uri={
            postDetail.thumbnailImage
              ? postDetail.thumbnailImage.url
              : "https://vollrath.com/ClientCss/images/VollrathImages/No_Image_Available.jpg"
          }
          resizeMode={"cover"}
          style={{ height: 150 }}
        />
        <InputField
          label={"Tittle"}
          placeholder={"Input your title"}
          placeholderTextColor={colors.text68}
          customWrapperStyle={{ marginBottom: 15 }}
          inputType="text"
          onChangeText={value => this._handleInputChanged("title", value)}
          value={this._capitalizeLetter(postDetail.title)}
          returnKeyType={"next"}
          editable={editMode}
        />
        <AutoComplete
          label={"Address"}
          editable={editMode}
          placeholder={"Input your address"}
          onFocus={() => this.setState({ hideResults: false })}
          hideResults={hideResults}
          data={location}
          value={postDetail.address}
          onChangeText={value => {
            this._handleInputChanged("address", value);
            this._handleAddressChange(value);
          }}
          renderItem={item => this._renderAutoCompleteItem(item)}
        />
        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: -10 }}
        >
          <Title title={"Service Requirement Types"} />
          {editMode && (
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={() => this.props.navigation.navigate("AddServicesTypes")}
            >
              <Feather name="plus-circle" size={20} />
            </TouchableOpacity>
          )}
        </View>

        <View>
          {typeServices !== undefined && typeServices.length > 0 ? (
            typeServices.map(item => (
              <View style={styles.rowTypeWrapper} key={item.id}>
                <Text style={[styles.text, { marginBottom: 5 }]}>
                  {this._capitalizeLetter(item.name)}
                </Text>
                {editMode ? (
                  <TouchableOpacity
                    onPress={() => this.props.fetchRemoveTypeServices(item.id)}
                  >
                    <Text style={styles.text}>Remove</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>
              No service information provided
            </Text>
          )}
          {editMode && (
            <View>
              <Title text={"Insert your image"} />
              {images.length > 0 ? (
                <View style={{ flex: 1 }}>
                  <Image
                    uri={images[imageIndex]}
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
            </View>
          )}
          {!editMode && <Title title={`Bids (${bids.length})`} />}
          {!editMode &&
            bids.map(bid => (
              <Bid
                key={bid.id.toString()}
                bid={bid}
                onPress={() => this._handleAcceptRequest(bid.id)}
                onPressContractor={() =>
                  this.props.navigation.navigate("ContractorProfile", {
                    id: bid.supplier.id
                  })
                }
              />
            ))}
        </View>
      </View>
    );
  };

  render() {
    const { editMode } = this.state;
    const { navigation } = this.props;
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ top: "always", bottom: "none" }}
      >
        <Header
          renderLeftButton={() => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather name="arrow-left" size={24} />
            </TouchableOpacity>
          )}
          renderRightButton={() =>
            editMode ? (
              <TouchableOpacity
                onPress={() =>
                  this.setState({ editMode: !this.state.editMode })
                }
              >
                <Text
                  style={{
                    fontWeight: "500",
                    color: colors.text,
                    fontSize: fontSize.bodyText
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() =>
                  this.setState({ editMode: !this.state.editMode })
                }
              >
                <Text
                  style={{
                    fontWeight: "500",
                    color: colors.text,
                    fontSize: fontSize.bodyText
                  }}
                >
                  Edit
                </Text>
              </TouchableOpacity>
            )
          }
        >
          <Text style={styles.header}>Post Detail</Text>
        </Header>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 15 }}>
          {this._renderContent()}
        </ScrollView>
        {editMode && (
          <SafeAreaView
            forceInset={{ bottom: "always" }}
            style={{ backgroundColor: colors.primaryColor }}
          >
            <Button
              text={"Save"}
              disabled={!editMode}
              bordered={false}
              onPress={this._handleSubmitEdit}
            />
          </SafeAreaView>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
  },
  rowTypeWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  text: {
    fontSize: fontSize.bodyText,
    fontWeight: "500",
    color: colors.text
  },
  emptyText: {
    fontSize: fontSize.secondaryText,
    color: colors.text50,
    fontWeight: "400"
  },
  header: {
    color: colors.primaryColor,
    fontSize: fontSize.bodyText,
    fontWeight: "600"
  },
  bidSupplierName: {
    fontSize: fontSize.bodyText,
    color: colors.text,
    fontWeight: "600"
  },
  bidTime: {
    fontSize: fontSize.caption,
    color: colors.text50,
    fontWeight: "400"
  },
  bidDescription: {
    fontSize: fontSize.bodyText,
    color: colors.text,
    fontWeight: "400",
    marginBottom: 10
  },
  bidPrice: {
    fontSize: fontSize.bodyText,
    color: colors.secondaryColor,
    fontWeight: "700"
  }
});

export default MyPostDetail;
