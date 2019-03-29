import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated
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

  _handleDebrisType = () => {
    const { debrisTypes } = this.props;
    console.log(debrisTypes);
    let newDebrisTypeArray = debrisTypes.map(item => ({
      id: item.id,
      name: item.name,
      value: item.name
    }));
    return [...DROPDOWN_DEBRIS_TYPE_OPTIONS, ...newDebrisTypeArray];
  };

  // _showBidItem = (id, name) => (
  //   <TouchableOpacity
  //     key={id}
  //     style={styles.itemWrapper}
  //     onPress={() =>
  //       this.props.navigation.navigate("BidResult", {
  //         typeId: id
  //       })
  //     }
  //   >
  //     <Text style={styles.text}>{name}</Text>
  //     <Feather name="chevron-right" size={24} />
  //   </TouchableOpacity>
  // );

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
      typeId: debrisTypeIndex > 0 ? debrisTypes[debrisTypeIndex - 1].id : 0
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
              <Text>Search</Text>
            </TouchableOpacity>
          )}
        />
        <Dropdown
          style={{ marginBottom: 10 }}
          isHorizontal={true}
          label={"Debris type"}
          defaultText={DROPDOWN_DEBRIS_TYPE_OPTIONS[0].name}
          onSelectValue={(value, index) => {
            this.setState({ debrisTypeIndex: index, debrisType: value });
          }}
          options={this._handleDebrisType()}
        />
      </View>
    );
  };

  render() {
    const { loading } = this.props;
    return (
      <SafeAreaView style={styles.container} forceInset={{ top: "always" }}>
        <ParallaxList
          title={"Search debris bid"}
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
  }
});

export default BidSearch;
