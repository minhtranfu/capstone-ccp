import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import { searchDebris } from "../../redux/actions/debris";
import Feather from "@expo/vector-icons/Feather";

import SearchBar from "../../components/SearchBar";
import Loading from "../../components/Loading";
import Header from "../../components/Header";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

@connect(
  state => ({
    results: state.debris.listSearch,
    loading: state.debris.loading
  }),
  dispatch => ({
    fetchSearchDebris: debrisTypeId => {
      dispatch(searchDebris(debrisTypeId));
    }
  })
)
class BidResult extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { typeId } = this.props.navigation.state.params;
    this.props.fetchSearchDebris(typeId);
  }

  _renderContent = () => {
    const { results } = this.props;
    return (
      <View>
        {results.map(item => (
          <Text>{item.title}</Text>
        ))}
      </View>
    );
  };

  render() {
    const { loading } = this.props;
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "always", top: "always" }}
      >
        <Header
          renderLeftButton={() => (
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Feather name="chevron-left" size={24} />
            </TouchableOpacity>
          )}
        >
          <Text>Results</Text>
        </Header>
        {!loading ? (
          <ScrollView>{this._renderContent()}</ScrollView>
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

export default BidResult;
