import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl
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

import PlaceBid from "./component/PlaceBid";
import Bidder from "../../components/Bidder";
import SearchBar from "../../components/SearchBar";
import Loading from "../../components/Loading";
import Header from "../../components/Header";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";
import Title from "../../components/Title";

const STATUS = {
  PENDING: "OPENING",
  ACCEPTED: "IN PROGRESS"
};

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

  _setModalVisible = visible => {
    this.setState({ modalVisible: visible });
  };

  _renderContractorBid = () => {
    const { detail } = this.props;
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
            style={{ width: 40, height: 40, borderRadius: 20 }}
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
      </View>
    );
  };

  _renderBottomButton = contractorId => {
    const { detail } = this.props;
    const bidDetail = detail.debrisBids.find(
      item => item.supplier.id === contractorId
    );
    console.log(bidDetail);
    if (bidDetail) {
      return (
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
          <TouchableOpacity onPress={() => this._setModalVisible(true)}>
            <Text style={styles.text}>Edit bid</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View>
          <PlaceBid
            visible={this.state.modalVisible}
            postId={this.props.detail.id}
            title={detail.title}
            setModalVisible={this._setModalVisible}
          />
          <TouchableOpacity onPress={() => this._setModalVisible(true)}>
            <Text style={styles.text}>Place a bid</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  _renderContent = detail => {
    console.log(detail);
    return (
      <View>
        <Text style={styles.title}>{detail.title}</Text>
        <Text style={styles.status}>{STATUS[detail.status]}</Text>
        {detail.description ? (
          <Text style={styles.text}>Description: {detail.description}</Text>
        ) : null}
        <Title title={"Services required"} />
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {detail.debrisServiceTypes.map(item => (
            <Text style={styles.text}>{item.name}</Text>
          ))}
        </View>
        <View style={styles.divider} />
        <Text style={styles.text}>Requester</Text>
        {this._renderContractorBid()}
        <View style={styles.divider} />
        <Text style={[styles.text, { marginBottom: 15 }]}>Bids</Text>
        {detail.debrisBids.length > 0 ? (
          detail.debrisBids.map(item => (
            <View>
              <Bidder
                imageUrl={item.supplier.thumbnailImage}
                name={item.supplier.name}
                rating={item.supplier.averageDebrisRating}
                phone={item.supplier.phoneNumber}
                price={item.price}
                description={item.description}
              />
            </View>
          ))
        ) : (
          <Text style={styles.text}>No bids yet</Text>
        )}
      </View>
    );
  };

  render() {
    const { detail, user, navigation, loading } = this.props;
    console.log(loading);
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
            <View>{this._renderBottomButton(user.contractor.id)}</View>
          </ScrollView>
        ) : (
          <Loading />
        )}
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
  }
});

export default BidDetail;
