import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions
} from "react-native";
import { Image } from "react-native-expo-image-cache";
import { SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import {
  supplierPlaceBid,
  getDebrisBidDetail,
  clearDebrisDetail
} from "../../redux/actions/debris";
import Feather from "@expo/vector-icons/Feather";
import { Rating } from "react-native-ratings";
import moment from "moment";
import Swiper from "react-native-swiper";

import PlaceBid from "./component/PlaceBid";
import Bidder from "../../components/Bidder";
import SearchBar from "../../components/SearchBar";
import Loading from "../../components/Loading";
import Header from "../../components/Header";
import Button from "../../components/Button";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";
import Title from "../../components/Title";

const STATUS = {
  PENDING: "OPENING",
  ACCEPTED: "IN PROGRESS"
};

const { width } = Dimensions.get("window");

@connect(
  (state, ownProps) => {
    const { id } = ownProps.navigation.state.params;
    return {
      detail: state.debris.listSearch.find(item => item.id === id),
      user: state.auth.data,
      loading: state.debris.detailLoading
    };
  },
  dispatch => ({
    fetchGetBidDetail: debrisPostId => {
      dispatch(getDebrisBidDetail(debrisPostId));
    },
    fetchPlaceBid: debrisBids => {
      dispatch(supplierPlaceBid(debrisBids));
    },
    fetchClearDetail: () => {
      dispatch(clearDebrisDetail());
    }
  })
)
class BidDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      refreshing: false
    };
  }

  _renderSlideItem = (uri, key, loaded) => (
    <View style={styles.slide} key={key}>
      <Image style={styles.imageSlide} uri={uri} resizeMode={"contain"} />
    </View>
  );

  _capitializeLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  _setModalVisible = visible => {
    this.setState({ modalVisible: visible });
  };

  _renderContractorBid = () => {
    const { detail } = this.props;
    return (
      <TouchableOpacity
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
        onPress={() =>
          this.props.navigation.navigate("ContractorProfile", {
            id: detail.requester.id
          })
        }
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 5
          }}
        >
          <Image
            uri={detail.requester.thumbnailImageUrl}
            resizeMode={"cover"}
            style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
          />
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.bidSupplierName}>{detail.requester.name}</Text>
            <Rating
              readonly={true}
              ratingCount={5}
              fractions={1}
              startingValue={detail.requester.averageDebrisRating}
              imageSize={20}
              style={{
                paddingVertical: 10,
                backgroundColor: "transparent",
                alignItems: "flex-start"
              }}
            />
            <Text style={styles.bidTime}>
              Post created from: {moment(detail.createdTime).fromNow()}
            </Text>
          </View>
        </View>
        {detail.description ? (
          <Text style={styles.bidDescription}>{detail.description}</Text>
        ) : null}
      </TouchableOpacity>
    );
  };

  _renderBottomButton = contractorId => {
    const { detail } = this.props;
    const bidDetail = detail.debrisBids.find(
      item => item.supplier.id === contractorId
    );
    console.log(bidDetail);
    return (
      <SafeAreaView
        forceInset={{ bottom: "always" }}
        style={styles.bottomWrapper}
      >
        {bidDetail ? (
          <View>
            <PlaceBid
              visible={this.state.modalVisible}
              price={bidDetail.price}
              description={bidDetail.description}
              bidId={bidDetail.id}
              postId={detail.id}
              title={detail.title}
              setModalVisible={this._setModalVisible}
              isEdited={true}
            />
            <Button
              text={"Edit bid"}
              onPress={() => this._setModalVisible(true)}
              buttonStyle={{
                marginTop: 0,
                backgroundColor: colors.secondaryColor
              }}
              bordered={false}
            />
          </View>
        ) : (
          <View>
            <PlaceBid
              visible={this.state.modalVisible}
              postId={this.props.detail.id}
              title={detail.title}
              setModalVisible={this._setModalVisible}
            />
            <Button
              text={"Place a bid"}
              onPress={() => this._setModalVisible(true)}
              buttonStyle={{
                marginTop: 0,
                backgroundColor: colors.secondaryColor
              }}
              bordered={false}
            />
          </View>
        )}
      </SafeAreaView>
    );
  };

  _renderContent = detail => {
    console.log(detail);
    return (
      <View>
        <Image
          uri={detail.thumbnailImage ? detail.thumbnailImage.url : ""}
          resizeMode={"cover"}
          style={{ height: 200, marginHorizontal: -15, marginBottom: 15 }}
        />
        <Text style={styles.title}>{detail.title}</Text>
        <Text style={styles.status}>{STATUS[detail.status]}</Text>
        {detail.description ? (
          <Text style={styles.text}>Description: {detail.description}</Text>
        ) : null}
        <Text style={styles.subTitle}>Images list</Text>
        {detail.debrisImages.length > 0 ? (
          <Swiper
            style={styles.slideWrapper}
            loop={false}
            loadMinimal
            loadMinimalSize={1}
            activeDotColor={colors.secondaryColor}
            activeDotStyle={{ width: 30 }}
          >
            {detail.debrisImages
              .slice(0, 4)
              .map((item, index) => this._renderSlideItem(item.url, index))}
          </Swiper>
        ) : (
          <Text style={styles.text}>No images</Text>
        )}
        <Text style={[styles.subTitle, { marginTop: 5 }]}>
          Services require
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            flexWrap: "wrap"
          }}
        >
          {detail.debrisServiceTypes.map((item, index) => (
            <Text key={item.id} style={styles.text}>
              {this._capitializeLetter(item.name)}{" "}
              {index == detail.debrisServiceTypes.length - 1 ? null : "- "}
            </Text>
          ))}
        </View>
        <View style={styles.divider} />
        <Text style={styles.text}>Requester</Text>
        {this._renderContractorBid()}
        <View style={styles.divider} />
        <Text style={[styles.text, { marginBottom: 15 }]}>
          Bids ({detail.debrisBids.length})
        </Text>
        <View style={{ marginBottom: 10 }}>
          {detail.debrisBids.length > 0 ? (
            detail.debrisBids.map(item => (
              <Bidder
                key={item.supplier.id}
                imageUrl={item.supplier.thumbnailImageUrl}
                name={item.supplier.name}
                rating={
                  Math.round(item.supplier.averageDebrisRating * 100) / 100
                }
                phone={item.supplier.phoneNumber}
                price={item.price}
                description={item.description}
                feedbackCount={item.supplier.debrisFeedbacksCount}
              />
            ))
          ) : (
            <Text style={[styles.text, { marginBottom: 10 }]}>No bids yet</Text>
          )}
        </View>
      </View>
    );
  };

  render() {
    const { detail, user, navigation, loading } = this.props;
    console.log(loading);
    console.log(user);
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "always", top: "always" }}
      >
        <Header
          renderLeftButton={() => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather name="chevron-left" size={24} />
            </TouchableOpacity>
          )}
        />
        {!loading ? (
          <ScrollView
            contentContainerStyle={{ paddingHorizontal: 15 }}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
          >
            {this._renderContent(detail)}
          </ScrollView>
        ) : (
          <Loading />
        )}
        {Object.keys(user).length > 0
          ? !loading
            ? this._renderBottomButton(user.contractor.id)
            : null
          : null}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  divider: {
    height: 1,
    backgroundColor: colors.primaryColor,
    marginVertical: 10,
    paddingHorizontal: 15
  },
  title: {
    fontSize: fontSize.bodyText,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 5
  },
  subTitle: {
    fontSize: fontSize.bodyText,
    fontWeight: "500",
    color: colors.primaryColor,
    marginBottom: 5
  },
  status: {
    fontSize: fontSize.secondaryText,
    fontWeight: "600",
    color: colors.lightGreen,
    marginBottom: 5
  },
  text: {
    fontSize: fontSize.bodyText,
    fontWeight: "500"
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
  },
  slideWrapper: {
    height: 200
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "transparent"
  },
  imageSlide: {
    width: width,
    height: 200,
    backgroundColor: "transparent"
  }
});

export default BidDetail;
