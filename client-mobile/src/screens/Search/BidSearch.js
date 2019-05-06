import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Modal,
  Image
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
import Title from "../../components/Title";
import Button from "../../components/Button";

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
    this.state = {
      keyword: "",
      modalVisible: false,
      listType: [],
      tagSearch: ""
    };
  }

  componentDidMount() {
    this.props.fetchGetTypeSerivces();
  }

  _clearList = () => {
    this.setState({ listType: [] });
  };

  setModalVisible = visible => {
    this.setState({ modalVisible: visible });
  };

  _checkItemIsExist = id => {
    return this.state.listType.some(item => item.id === id);
  };

  _checkDataChanged = () => {
    if (this.state.listType.length > 0) {
      return true;
    }
    return false;
  };

  _handleRemoveItem = id => {
    this.setState({
      listType: this.state.listType.filter(item => item.id !== id)
    });
  };

  _handleAddItem = item => {
    console.log("add", item);
    this.setState({ listType: [...this.state.listType, item] });
  };

  _showModal = () => {
    const { tagSearch } = this.state;
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
                <TouchableOpacity
                  onPress={() => {
                    this.setModalVisible(false), this._clearList();
                  }}
                >
                  <Feather name="x" size={24} />
                </TouchableOpacity>
              )}
            />
            <View style={{ height: 44, marginHorizontal: 15 }}>
              <SearchBar
                style={{ height: 44 }}
                handleOnChangeText={value =>
                  this.setState({ tagSearch: value })
                }
                icon={"tag"}
                placeholder={"Search debris type "}
              />
            </View>
            <ScrollView style={{ paddingHorizontal: 15 }}>
              <Title title={"Debris types"} />
              {debrisTypes
                .filter(item => item.name.includes(tagSearch.toLowerCase()))
                .map(item => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.debrisTypeWrapper}
                    onPress={() =>
                      this._checkItemIsExist(item.id)
                        ? this._handleRemoveItem(item.id)
                        : this._handleAddItem(item)
                    }
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Image
                        source={require("../../../assets/icons/icons8-tags.png")}
                        resizeMode={"contain"}
                        style={{ width: 24, height: 24, marginRight: 10 }}
                      />
                      <Text style={styles.text}>
                        {this._capitializeLetter(item.name)}
                      </Text>
                    </View>

                    {this._checkItemIsExist(item.id) ? (
                      <Image
                        source={require("../../../assets/icons/icon_remove.png")}
                        resizeMode={"contain"}
                        style={{ width: 24, height: 24 }}
                      />
                    ) : (
                      <Image
                        source={require("../../../assets/icons/icon_add.png")}
                        resizeMode={"contain"}
                        style={{ width: 24, height: 24 }}
                      />
                    )}
                  </TouchableOpacity>
                ))}
            </ScrollView>
            <SafeAreaView
              forceInset={{ bottom: "always" }}
              style={{
                backgroundColor: this._checkDataChanged()
                  ? colors.secondaryColor
                  : "#a5acb8"
              }}
            >
              <Button
                text={"Confirm"}
                onPress={() => this.setModalVisible(false)}
                disabled={!this._checkDataChanged()}
                buttonStyle={{ backgroundColor: "transparent" }}
              />
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

  _handleSearch = () => {
    const { debrisTypeIndex, keyword, listType } = this.state;
    const { debrisTypes } = this.props;
    const data = {
      keyword,
      typeId: listType.map(item => ({ id: item.id }))
    };
    this.props.navigation.navigate("BidResult", { data });
  };

  _renderScrollContent = () => {
    const { debrisTypeIndex, debrisType } = this.state;
    return (
      <View style={{ paddingTop: 15, paddingHorizontal: 15, flex: 1 }}>
        <SearchBar
          style={{ height: 56, marginBottom: 5 }}
          handleOnChangeText={this._handleOnChangeText}
          icon={"navigation"}
          placeholder={"Search anything"}
          onSubmitEditing={this._handleSearch}
          renderRightButton={() => (
            <TouchableOpacity onPress={this._handleSearch}>
              <Text style={styles.searchText}>Search</Text>
            </TouchableOpacity>
          )}
        />
        {this._showModal()}
        <TouchableOpacity
          onPress={() => this.setModalVisible(true)}
          style={{
            width: 140,
            alignItems: "center",
            justifyContent: "center",
            height: 30,
            backgroundColor: colors.secondaryColor,
            borderRadius: 20
          }}
        >
          <Text style={styles.title}>Types filter</Text>
        </TouchableOpacity>
        {this.state.listType.length > 0 ? (
          <View>
            <Title title={"Already selected"} />
            {this.state.listType.map(item => (
              <View key={item.id}>
                <Text style={styles.text}>
                  {this._capitializeLetter(item.name)}
                </Text>
              </View>
            ))}
          </View>
        ) : null}
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
  debrisTypeWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 50,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.primaryColor
  },
  text: {
    fontSize: fontSize.secondaryText,
    fontWeight: "500",
    color: colors.primaryColor
  },
  searchText: {
    fontSize: fontSize.caption,
    color: colors.primaryColor,
    fontWeight: "600"
  },
  title: {
    fontSize: fontSize.bodyText,
    fontWeight: "500",
    color: colors.white
  }
});

export default BidSearch;
