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

import PlaceBid from "./component/PlaceBid";
import Bidder from "../../components/Bidder";
import SearchBar from "../../components/SearchBar";
import Loading from "../../components/Loading";
import Header from "../../components/Header";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

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
        <Text style={styles.text}>{STATUS[detail.status]}</Text>
        {detail.description ? (
          <Text style={styles.text}>Description: {detail.description}</Text>
        ) : null}
        <Text style={styles.text}>Total bids</Text>
        <Text style={styles.text}>
          {detail.debrisBids.length > 0 ? detail.debrisBids.length : 0}
        </Text>
        <Text style={styles.text}>Services required</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {detail.debrisServiceTypes.map(item => (
            <Text style={styles.text}>{item.name}</Text>
          ))}
        </View>
        <View style={styles.divider} />
        <Text style={styles.text}>Requester</Text>
        <Bidder
          imageUrl={detail.requester.thumbnailImage}
          name={detail.requester.name}
          rating={detail.requester.averageDebrisRating}
          phone={detail.requester.phoneNumber}
        />
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
    fontSize: fontSize.h4,
    fontWeight: "bold"
  },
  text: {
    fontSize: fontSize.bodyText,
    fontWeight: "500"
  }
});

export default BidDetail;
