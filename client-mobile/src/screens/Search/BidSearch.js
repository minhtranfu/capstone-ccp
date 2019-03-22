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
import { getAllDebrisServiceTypes } from "../../redux/actions/debris";
import Feather from "@expo/vector-icons/Feather";

import SearchBar from "../../components/SearchBar";
import Loading from "../../components/Loading";
import Header from "../../components/Header";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

@connect(
  state => ({
    debrisTypes: state.debris.debrisTypes,
    loading: state.debris.loading
  }),
  dispatch => ({
    fetchGetTypeSerivces: () => {
      dispatch(getAllDebrisServiceTypes());
    }
  })
)
class BidSearch extends Component {
  constructor(props) {
    super(props);
    this.state = { keyword: "" };
  }

  componentDidMount() {
    this.props.fetchGetTypeSerivces();
  }

  _handleOnChangeText = value => {
    const { keyword } = this.state;
    this.setState({
      keyword: value.toLowerCase()
    });
  };

  _showBidItem = (id, name) => (
    <TouchableOpacity
      key={id}
      style={styles.itemWrapper}
      onPress={() =>
        this.props.navigation.navigate("BidResult", {
          typeId: id
        })
      }
    >
      <Text style={styles.text}>{name}</Text>
      <Feather name="chevron-right" size={24} />
    </TouchableOpacity>
  );

  _renderItem = () => {
    const { debrisTypes } = this.props;
    const { keyword } = this.state;
    let values = [];
    if (keyword && keyword.length > 0)
      values = debrisTypes.filter(item => item.name.includes(keyword));
    return (
      <View style={{ paddingHorizontal: 15, paddingTop: 15 }}>
        {debrisTypes
          .filter(item => item.name.includes(keyword))
          .map(item => this._showBidItem(item.id, item.name))}
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
        <SearchBar
          handleOnChangeText={this._handleOnChangeText}
          renderRightButton={() => (
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Text style={styles.text}>Cancel</Text>
            </TouchableOpacity>
          )}
        />
        {!loading ? <ScrollView>{this._renderItem()}</ScrollView> : <Loading />}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  itemWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomColor: colors.primaryColor,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingBottom: 15
  },
  text: {
    fontSize: fontSize.bodyText,
    fontWeight: "500"
  }
});

export default BidSearch;
