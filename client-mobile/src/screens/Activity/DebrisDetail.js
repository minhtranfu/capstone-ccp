import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { connect } from "react-redux";
import { SafeAreaView } from "react-navigation";
import { sendRequestDebrisTransaction } from "../../redux/actions/transaction";
import Feather from "@expo/vector-icons/Feather";

import DebrisBid from "./components/DebrisBid";
import Header from "../../components/Header";
import Loading from "../../components/Loading";
import DebrisSearchItem from "../../components/DebrisSearchItem";
import Button from "../../components/Button";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

@connect(
  (state, ownProps) => {
    const { id } = ownProps.navigation.state.params;
    return {
      detail: state.transaction.listRequesterDebris.find(item => item.id === id)
    };
  },
  dispatch => ({
    fetchSendRequest: transaction => {
      dispatch(sendRequestDebrisTransaction(transaction));
    }
  })
)
class DebrisDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  _handleRequestTransaction = (postId, bidId) => {
    const transaction = {
      debrisPost: {
        id: postId
      },
      debrisBid: {
        id: bidId
      }
    };
    this.props.fetchSendRequest(transaction);
  };

  _renderContent = () => {
    const { detail } = this.props;
    return (
      <View>
        <Text>{detail.debrisPost.title}</Text>
        <Text>{detail.debrisPost.address}</Text>
        <Text>Total bids ({detail.debrisPost.debrisBids.length})</Text>
        {detail.debrisPost.debrisBids.slice(0, 3).map(item => (
          <DebrisBid
            description={item.description}
            price={item.price}
            rating={item.supplier.averageDebrisRating}
            thumbnailUrl={item.supplier.thumbnailImage}
            supplierName={item.supplier.name}
            onPress={() =>
              this._handleRequestTransaction(detail.debrisPost.id, item.id)
            }
          />
        ))}
        {detail.debrisPost.debrisBids.length > 4 ? (
          <TouchableOpacity>
            <Text>Show more</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };

  render() {
    const { navigation } = this.props;
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "always", top: "always" }}
      >
        <Header
          renderLeftButton={() => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather name={"chevron-left"} size={24} />
            </TouchableOpacity>
          )}
        >
          <Text>Debris Detail</Text>
        </Header>
        <ScrollView>{this._renderContent()}</ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default DebrisDetail;
