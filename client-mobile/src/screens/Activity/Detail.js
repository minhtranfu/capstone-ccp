import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { connect } from "react-redux";
import { SafeAreaView } from "react-navigation";
import PropTypes from "prop-types";
import { Feather } from "@expo/vector-icons";
import { getTransactionDetail } from "../../redux/actions/equipment";

import Header from "../../components/Header";
import Loading from "../../components/Loading";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

@connect(
  state => {
    return {
      detail: state.equipment.transactionDetail
    };
  },
  dispatch => ({
    fetchTransactionDetail: id => {
      dispatch(getTransactionDetail(id));
    }
  })
)
class ActivityDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { id } = this.props.navigation.state.params;
    this.props.fetchTransactionDetail(id);
  }

  componentDidUpdate(prevProps) {
    const { id } = this.props.navigation.state.params;
    if (id !== prevProps.detail.data.id) {
      this.props.fetchTransactionDetail(id);
    }
  }

  _renderScrollViewItem = () => {
    const { detail } = this.props;
    return (
      <View>
        <Image />
      </View>
    );
  };

  render() {
    const { detail } = this.props;
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "never", top: "always" }}
      >
        <Header
          renderLeftButton={() => (
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Feather name="x" size={24} />
            </TouchableOpacity>
          )}
        >
          <Text style={styles.title}>Detail Transaction</Text>
        </Header>
        {detail.data ? (
          <ScrollView>{this._renderScrollViewItem()}</ScrollView>
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
  title: {
    fontSize: fontSize.h4,
    fontWeight: "600"
  }
});

export default ActivityDetail;
