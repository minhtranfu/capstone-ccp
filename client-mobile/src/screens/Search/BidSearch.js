import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Modal
} from "react-native";
import { SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import { getAllDebrisServiceTypes } from "../../redux/actions/debris";
import Feather from "@expo/vector-icons/Feather";

import Dropdown from "../../components/Dropdown";
import ParallaxList from "../../components/ParallaxList";
import SearchBar from "../../components/SearchBar";
import Loading from "../../components/Loading";
import Header from "../../components/Header";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

const DROPDOWN_DEBRIS_TYPE_OPTIONS = [
  {
    id: 0,
    name: "Any Type",
    value: "Any Type"
  }
];

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
    this.state = { keyword: "", modalVisible: false };
  }

  componentDidMount() {
    this.props.fetchGetTypeSerivces();
  }

  setModalVisible = visible => {
    this.setState({ modalVisible: visible });
  };

  _showModal = () => {
    const { debrisTypes } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <SafeAreaView style={{ flex: 1 }} forceInset={{ top: "always" }}>
            <Header
              renderLeftButton={() => (
                <TouchableOpacity onPress={() => this.setModalVisible(false)}>
                  <Feather name="x" size={24} />
                </TouchableOpacity>
              )}
            />
            <View style={{ height: 44, marginHorizontal: 15 }}>
              <SearchBar
                style={{ height: 44 }}
                handleOnChangeText={this._handleOnChangeText}
                icon={"navigation"}
                placeholder={"Search debris type "}
                onSubmitEditing={this._handleSearch}
              />
            </View>
            <Text>Debris types</Text>
            <ScrollView style={{ paddingHorizontal: 15 }}>
              {debrisTypes.map(item => (
                <TouchableOpacity key={item.id}>
                  <Text>{this._capitializeLetter(item.name)}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <SafeAreaView forceInset={{ bottom: "always" }}>
              <TouchableOpacity
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}
              >
                <Text>Hide Modal</Text>
              </TouchableOpacity>
            </SafeAreaView>
          </SafeAreaView>
        </Modal>
      </View>
    );
  };

  _capitializeLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  _handleOnChangeText = value => {
    const { keyword } = this.state;
    this.setState({
      keyword: value.toLowerCase()
    });
  };

  // _renderItem = () => {
  //   const { debrisTypes } = this.props;
  //   const { keyword } = this.state;
  //   let values = [];
  //   if (keyword && keyword.length > 0)
  //     values = debrisTypes.filter(item => item.name.includes(keyword));
  //   return (
  //     <View style={{ paddingHorizontal: 15, paddingTop: 15 }}>
  //       {debrisTypes
  //         .filter(item => item.name.includes(keyword))
  //         .map(item => this._showBidItem(item.id, item.name))}
  //     </View>
  //   );
  // };

  _handleSearch = () => {
    const { debrisTypeIndex, keyword } = this.state;
    const { debrisTypes } = this.props;

    this.props.navigation.navigate("BidResult", {
      keyword: keyword,
      typeId: debrisTypeIndex > 0 ? debrisTypes[debrisTypeIndex - 1].id : ""
    });
  };

  _renderScrollContent = () => {
    const { debrisTypeIndex, debrisType } = this.state;
    return (
      <View style={{ paddingTop: 15, paddingHorizontal: 15, flex: 1 }}>
        <SearchBar
          style={{ height: 56, marginBottom: 5 }}
          handleOnChangeText={this._handleOnChangeText}
          icon={"navigation"}
          placeholder={"Enter keyword"}
          onSubmitEditing={this._handleSearch}
          renderRightButton={() => (
            <TouchableOpacity onPress={this._handleSearch}>
              <Text style={styles.searchText}>Search</Text>
            </TouchableOpacity>
          )}
        />
        {this._showModal()}
        <TouchableOpacity onPress={() => this.setModalVisible(true)}>
          <Text>Debris type</Text>
        </TouchableOpacity>
        <View />
      </View>
    );
  };

  render() {
    const { loading } = this.props;
    return (
      <SafeAreaView style={styles.container} forceInset={{ top: "always" }}>
        <ParallaxList
          title={"Search debris post"}
          hasLeft={true}
          scrollElement={<Animated.ScrollView />}
          renderScrollItem={this._renderScrollContent}
        />
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
  },
  searchText: {
    fontSize: fontSize.caption,
    color: colors.primaryColor,
    fontWeight: "600"
  }
});

export default BidSearch;
