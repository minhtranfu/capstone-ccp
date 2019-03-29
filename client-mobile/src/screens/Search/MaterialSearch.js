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
import {
  getGeneralMaterialType,
  getMaterialType
} from "../../redux/actions/material";
import { autoCompleteSearch } from "../../redux/actions/location";
import Feather from "@expo/vector-icons/Feather";

import ParallaxList from "../../components/ParallaxList";
import Dropdown from "../../components/Dropdown";
import SearchBar from "../../components/SearchBar";
import Loading from "../../components/Loading";
import Header from "../../components/Header";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

const DROPDOWN_MATERIAL_TYPE_OPTIONS = [
  {
    id: 0,
    name: "Any Category",
    value: "Any Category"
  }
];

@connect(
  state => ({
    loading: state.material.loading,
    generalMaterialType: state.material.generalMaterialType,
    materialType: state.material.materialType
  }),
  dispatch => ({
    fetchGetGeneralMaterialType: () => {
      dispatch(getGeneralMaterialType());
    },
    fetchGetMaterialType: () => {
      dispatch(getMaterialType());
    }
  })
)
class MaterialSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: "",
      materialType: "",
      materialTypeIndex: 0
    };
  }

  componentDidMount() {
    this.props.fetchGetMaterialType();
  }

  _handleOnChangeText = value => {
    this.setState({
      keyword: value.toLowerCase()
    });
  };

  //Create new dropdown options for general type
  _handleMaterialType = () => {
    const { materialType } = this.props;
    let newMaterialTypeArray = materialType.map(item => ({
      id: item.id,
      name: item.name,
      value: item.name
    }));
    return [...DROPDOWN_MATERIAL_TYPE_OPTIONS, ...newMaterialTypeArray];
  };

  _handleSearch = () => {
    const { materialType } = this.props;
    const { materialTypeIndex, keyword } = this.state;
    console.log(materialTypeIndex);
    console.log(materialType);
    this.props.navigation.navigate("MaterialResult", {
      keyword: keyword,
      id: materialTypeIndex > 0 ? materialType[materialTypeIndex - 1].id : 0
    });
  };

  _renderScrollContent = () => {
    return (
      <View style={{ paddingTop: 15, paddingHorizontal: 15, flex: 1 }}>
        <SearchBar
          style={{ height: 56, marginBottom: 5 }}
          handleOnChangeText={this._handleOnChangeText}
          icon={"navigation"}
          placeholder={"Enter material keyword"}
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
          label={"Material type"}
          defaultText={DROPDOWN_MATERIAL_TYPE_OPTIONS[0].name}
          onSelectValue={(value, index) => {
            this.setState({ materialTypeIndex: index, materialType: value });
          }}
          options={this._handleMaterialType()}
        />
      </View>
    );
  };

  render() {
    const { loading } = this.props;
    return (
      <SafeAreaView style={styles.container} forceInset={{ top: "always" }}>
        <ParallaxList
          title={"Search Material"}
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

export default MaterialSearch;
