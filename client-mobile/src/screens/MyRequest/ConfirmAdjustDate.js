import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { requestAdjustTransaction } from "../../redux/actions/transaction";
import Feather from "@expo/vector-icons/Feather";

import Header from "../../components/Header";
import Loading from "../../components/Loading";
import Button from "../../components/Button";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

@connect(
  state => ({}),
  dispatch =>
    bindActionCreators({ fetchAdjustDate: requestAdjustTransaction }, dispatch)
)
class ConfirmAdjustDate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  _handleConfirmAdjustDate = async (requestedDate, id) => {
    const date = {
      hiringTransactionEntity: { id },
      requestedEndDate: requestedDate
    };
    this.setState({ loading: true });
    await this.props.fetchAdjustDate(date, id);
    this.setState({ loading: false });
    this.props.navigation.goBack();
  };

  render() {
    const { date, id } = this.props.navigation.state.params;
    console.log(id);
    return (
      <SafeAreaView
        forceInset={{ top: "always", bottom: "always" }}
        style={styles.container}
      >
        <Header
          renderLeftButton={() => (
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Feather name={"chevron-left"} size={24} />
            </TouchableOpacity>
          )}
        >
          <Text>Confirm adjust transaction</Text>
        </Header>
        {!this.state.loading ? (
          <ScrollView contentContainerStyle={{ paddingHorizontal: 15 }}>
            <Text>Adjust Transaction Date</Text>
            <Text>To: {date}</Text>
            <TouchableOpacity
              onPress={() => this._handleConfirmAdjustDate(date, id)}
            >
              <Text> Confirm </Text>
            </TouchableOpacity>
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
  }
});

export default ConfirmAdjustDate;
