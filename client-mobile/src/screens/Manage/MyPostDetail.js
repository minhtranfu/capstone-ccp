import React, { Component } from "react";
import { SafeAreaView } from "react-navigation";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { connect } from "react-redux";
import {
  addTypeServices,
  removeTypeServices,
  clearTypeServices,
  editArticle
} from "../../redux/actions/debris";
import { sendRequestDebrisTransaction } from "../../redux/actions/transaction";
import Feather from "@expo/vector-icons/Feather";

import Bidder from "../../components/Bidder";
import Button from "../../components/Button";
import Header from "../../components/Header";
import InputField from "../../components/InputField";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

@connect(
  (state, ownProps) => {
    const { id } = ownProps.navigation.state.params;
    return {
      detail: state.debris.debrisArticles.find(item => item.id === id),
      typeServices: state.debris.typeServices
    };
  },
  dispatch => ({
    fetchSendRequest: transaction => {
      dispatch(sendRequestDebrisTransaction(transaction));
    }
  })
)
class MyPostDetail extends Component {
  _capitalizeLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

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
    this.props.navigation.goBack();
  };

  _renderContent = () => {
    const { detail } = this.props;
    return (
      <View>
        <Text style={styles.text}>{detail.title}</Text>
        <Text style={styles.text}>{detail.status}</Text>
        <Text style={styles.text}>Total bids ({detail.debrisBids.length})</Text>
        {detail.debrisBids.map(item => (
          <View key={item.id}>
            <Bidder
              description={item.description}
              price={item.price}
              rating={item.supplier.averageDebrisRating}
              imageUrl={item.supplier.thumbnailImage}
              name={item.supplier.name}
              hasDivider={true}
            />
            {detail.status === "PENDING" ? (
              <TouchableOpacity
                onPress={() =>
                  this._handleRequestTransaction(detail.id, item.id)
                }
              >
                <Text style={styles.text}>Hire</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ))}
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
              <Feather name="chevron-left" size={24} />
            </TouchableOpacity>
          )}
        >
          <Text style={styles.text}>Detail</Text>
        </Header>
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
  }
});

export default MyPostDetail;
