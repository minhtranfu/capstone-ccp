import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { Image } from "react-native-expo-image-cache";
import { SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import { supplierPlaceBid } from "../../redux/actions/debris";
import Feather from "@expo/vector-icons/Feather";

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
      detail: state.debris.listSearch.find(item => item.id === id)
    };
  },
  dispatch => ({
    fetchPlaceBid: debrisBids => {
      dispatch(supplierPlaceBid(debrisBids));
    }
  })
)
class BidDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  _renderContent = () => {
    const { detail } = this.props;
    return (
      <View>
        <Text>{detail.title}</Text>
        <Text>{STATUS[detail.status]}</Text>
        {detail.description ? <Text>{detail.description}</Text> : null}
        <Text>Total bids</Text>
        <Text>{detail.debrisBids.length}</Text>
        <Text>Services required</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {detail.debrisServiceTypes.map(item => (
            <Text>{item.name}</Text>
          ))}
        </View>
        <Text>Requester</Text>
        <Bidder
          imageUrl={detail.requester.thumbnailImage}
          name={detail.requester.name}
          rating={detail.requester.averageDebrisRating}
          phone={detail.requester.phoneNumber}
        />
        <Text>Bids</Text>
        {detail.debrisBids.length > 0 ? (
          detail.debrisBids.map(item => (
            <Bidder
              imageUrl={item.supplier.thumbnailImage}
              name={item.supplier.name}
              rating={item.supplier.averageDebrisRating}
              phone={item.supplier.phoneNumber}
            />
          ))
        ) : (
          <Text>No bids yet</Text>
        )}
      </View>
    );
  };

  render() {
    const { detail } = this.props;
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "always", top: "always" }}
      >
        <Header
          renderLeftButton={() => (
            <TouchableOpacity>
              <Feather name="chevron-left" size={24} />
            </TouchableOpacity>
          )}
        />
        <ScrollView contentContainerStyle={{ paddingHorizontal: 15 }}>
          {this._renderContent()}
        </ScrollView>
        <View style={{ position: "absolute", bottom: 0 }}>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate("ConfirmBid", { id: detail.id })
            }
          >
            <Text>Place a bid</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default BidDetail;
