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
import {
  getGeneralMaterialType,
  getMaterialType
} from "../../redux/actions/material";
import { autoCompleteSearch } from "../../redux/actions/location";
import Feather from "@expo/vector-icons/Feather";

import Dropdown from "../../components/Dropdown";
import SearchBar from "../../components/SearchBar";
import Loading from "../../components/Loading";
import Header from "../../components/Header";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

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
      materialName: ""
    };
  }

  componentDidMount() {
    this.props.fetchGetMaterialType();
  }

  _handleOnChangeText = value => {
    const { materialName } = this.state;
    this.setState({
      materialName: value.toLowerCase()
    });
  };

  _showMaterialItem = (id, name) => (
    <TouchableOpacity
      key={id}
      style={styles.itemWrapper}
      onPress={() =>
        this.props.navigation.navigate("MaterialResult", {
          materialName: name
        })
      }
    >
      <Text style={styles.text}>{name}</Text>
      <Feather name="chevron-right" size={24} />
    </TouchableOpacity>
  );

  _renderItem = () => {
    const { materialType } = this.props;
    const { materialName } = this.state;
    let values = [];
    if (materialName && materialName.length > 0)
      values = materialType.filter(item => item.name.includes(materialName));
    return (
      <View style={{ paddingHorizontal: 15, paddingTop: 15 }}>
        {materialType
          .filter(item => item.name.includes(materialName))
          .map(item => this._showMaterialItem(item.id, item.name))}
      </View>
    );
  };

  render() {
    const { loading } = this.props;
    const { materialName } = this.state;
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "never", top: "always" }}
      >
        <SearchBar
          handleOnChangeText={this._handleOnChangeText}
          onSubmitEditing={() =>
            this.props.navigation.navigate("MaterialResult", {
              materialName: materialName
            })
          }
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

export default MaterialSearch;
