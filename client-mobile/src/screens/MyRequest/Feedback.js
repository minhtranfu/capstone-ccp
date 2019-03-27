import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated
} from "react-native";
import { connect } from "react-redux";
import { SafeAreaView } from "react-navigation";
import { Feather } from "@expo/vector-icons";
import { sendDebrisFeedback } from "../../redux/actions/debris";
import { AirbnbRating } from "react-native-ratings";

import ParallaxList from "../../components/ParallaxList";
import TextArea from "../../components/TextArea";
import Button from "../../components/Button";
import Loading from "../../components/Loading";
import Header from "../../components/Header";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

@connect(
  state => ({
    contractor: state.contractor.detail
  }),
  dispatch => ({
    fetchSendFeedback: (id, contractor) => {
      dispatch(sendDebrisFeedback(id, contractor));
    }
  })
)
class Feedback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: 0,
      content: "",
      dataChanged: false
    };
  }

  ratingCompleted = rating => {
    console.log("Rating is: " + rating);
    this.setState({ rating });
  };

  _handleSubmitFeedback = () => {
    const { rating, content } = this.state;
    const { transactionId, type } = this.props.navigation.state.params;
    const feedback = {
      rating,
      content
    };
    switch (type) {
      case "Debris":
        return this.props.fetchSendFeedback({
          ...feedback,
          debrisTransaction: { id: transactionId }
        });
      case "Equipment":
      case "Material":
      default:
        return null;
    }
  };

  _renderScrollViewItem = () => {
    const { content } = this.state;
    return (
      <View style={{ paddingHorizontal: 15, paddingTop: 15 }}>
        <AirbnbRating
          count={5}
          reviews={["Terrible", "Bad", "Good", "Very Good", "Amazing"]}
          onFinishRating={rating => this.ratingCompleted(rating)}
          size={20}
        />
        <Text style={styles.label}>Feedback</Text>
        <TextArea
          numberOfLines={5}
          maxLength={1000}
          onChangeText={value =>
            this.setState({ content: value, dataChanged: true })
          }
          value={content}
        />
      </View>
    );
  };

  render() {
    const { dataChanged } = this.state;
    return (
      <SafeAreaView
        forceInset={{ bottom: "never", top: "always" }}
        style={styles.containter}
      >
        <View style={{ flex: 1, flexDirection: "column" }}>
          <ParallaxList
            title={"Feedback"}
            hasLeft={true}
            hasCart={false}
            scrollElement={<Animated.ScrollView />}
            renderScrollItem={this._renderScrollViewItem}
          />
          <SafeAreaView
            forceInset={{ bottom: "always" }}
            style={{
              backgroundColor: dataChanged ? colors.secondaryColor : "#a5acb8"
            }}
          >
            <Button
              text={"Submit"}
              onPress={this._handleSubmitFeedback}
              disabled={!dataChanged}
              buttonStyle={{ backgroundColor: "transparent" }}
            />
          </SafeAreaView>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  containter: {
    flex: 1
  },
  header: {
    fontSize: fontSize.h4,
    fontWeight: "600"
  },
  text: {
    fontSize: fontSize.bodyText,
    fontWeight: "500",
    color: "white"
  },
  label: {
    fontSize: fontSize.secondaryText,
    color: colors.text68,
    fontWeight: "400",
    marginTop: 5
  }
});

export default Feedback;
