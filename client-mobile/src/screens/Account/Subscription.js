import React, { PureComponent } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import {
  getSubscriptions,
  deleteSubscription
} from "../../redux/actions/subscription";
import { connect } from "react-redux";
import { SafeAreaView } from "react-navigation";
import Feather from "@expo/vector-icons/Feather";

import {
  Header,
  Left,
  Right,
  Button as HeaderButton,
  Body
} from "../../components/AnimatedHeader";
import Loading from "../../components/Loading";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

@connect(
  state => ({
    subscription: state.subscription
  }),
  dispatch => ({
    getSubscriptions: () => dispatch(getSubscriptions()),
    deleteSubscription: id => dispatch(deleteSubscription(id))
  })
)
class Subscription extends PureComponent {
  componentDidMount() {
    this.props.getSubscriptions();
  }

  _handleGoBack = () => {
    this.props.navigation.goBack();
  };

  render() {
    const { listSubscription } = this.props.subscription;
    if (!listSubscription) return null;

    return (
      <SafeAreaView
        style={{ flex: 1 }}
        forceInset={{ bottom: "always", top: "always" }}
      >
        <Header style={{ position: "relative" }}>
          <Left>
            <TouchableOpacity onPress={this._handleGoBack}>
              <Feather name="chevron-left" size={24} />
            </TouchableOpacity>
          </Left>
          <Body title="Subscription" />
          <Right>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("AddSubscription")}
            >
              <Feather name="plus" size={24} />
            </TouchableOpacity>
          </Right>
        </Header>
        <ScrollView style={{ flex: 1, paddingVertical: 30 }}>
          {/* <Text>Ho</Text> */}
          {listSubscription.length > 0 ? (
            listSubscription.map(item => {
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() =>
                    this.props.navigation.navigate("EditSubscription", {
                      id: item.id
                    })
                  }
                  style={{
                    marginTop: 10,
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center"
                  }}
                >
                  <View>
                    <Text>ID: {item.id}</Text>
                    <Text>
                      Location: {item.latitude} / {item.longitude}
                    </Text>
                    <Text>Begin date: {item.beginDate}</Text>
                    <Text>End date: {item.endDate}</Text>
                  </View>
                  <View>
                    <TouchableOpacity
                      style={{
                        backgroundColor: "red",
                        padding: 10,
                        borderRadius: 5
                      }}
                      onPress={() => this.props.deleteSubscription(item.id)}
                    >
                      <Text>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <Loading />
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default Subscription;
