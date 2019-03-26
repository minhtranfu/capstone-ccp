import React, { PureComponent } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import {
  getSubscriptions,
  deleteSubscription
} from "../../redux/actions/subscription";
import { connect } from "react-redux";
import { SafeAreaView } from "react-navigation";

class Subscription extends PureComponent {
  componentDidMount() {
    this.props.getSubscriptions();
  }

  render() {
    const { listSubscription } = this.props.subscription;
    if (!listSubscription.length) return null;

    console.log("ahihihi listSubscription", listSubscription);
    return (
      <SafeAreaView
        style={{ flex: 1 }}
        forceInset={{ bottom: "always", top: "always" }}
      >
        <ScrollView style={{ flex: 1, paddingVertical: 30 }}>
          {listSubscription.map(item => {
            return (
              <View
                key={item.id}
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
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default connect(
  state => ({
    subscription: state.subscription
  }),
  dispatch => ({
    getSubscriptions: () => dispatch(getSubscriptions()),
    deleteSubscription: id => dispatch(deleteSubscription(id))
  })
)(Subscription);
