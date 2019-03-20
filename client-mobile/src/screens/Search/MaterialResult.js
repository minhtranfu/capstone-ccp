import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList
} from "react-native";
import { SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import { searchMaterial } from "../../redux/actions/material";
import { mockMaterialData } from "../../Utils/MockData";
import Feather from "@expo/vector-icons/Feather";
import { Image } from "react-native-expo-image-cache";

import MaterialSearchItem from "../../components/MaterialSearchItem";
import Loading from "../../components/Loading";
import Header from "../../components/Header";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

@connect(
  state => ({
    loading: state.material.loading,
    listMaterial: state.material.listSearch
  }),
  dispatch => ({
    fetchSearchMaterial: name => {
      dispatch(searchMaterial(name));
    }
  })
)
class MaterialResult extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { materialName } = this.props.navigation.state.params;
    this.props.fetchSearchMaterial(materialName);
  }

  _renderItem = ({ item }) => (
    <View style={{ flex: 1, marginHorizontal: 15 }}>
      <MaterialSearchItem
        imageUrl={
          item.thumbnailImageUrl
            ? item.thumbnailImageUrl
            : "http://lamnha.com/images/G01-02-1.png"
        }
        name={item.name}
        manufacturer={item.manufacturer}
        price={item.price}
        description={item.description}
      />
    </View>
  );

  _renderMaterialItem = ({ item }) => (
    <TouchableOpacity style={styles.itemWrapper}>
      <Image
        uri={item.ImageURL}
        resizeMode={"cover"}
        style={{ width: 70, height: 70 }}
      />
      <View style={{ paddingLeft: 5, flex: 2 }}>
        <Text style={styles.text}>{item.title}</Text>
        <Text style={styles.text}>{item.name}</Text>
        <Text style={styles.caption}> Price: {item.price}</Text>
      </View>
      <Feather name="chevron-right" size={24} />
    </TouchableOpacity>
  );

  render() {
    const { loading, listMaterial } = this.props;
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
          renderRightButton={() => (
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("MaterialSearch")}
            >
              <Feather name="search" size={24} />
            </TouchableOpacity>
          )}
        >
          <Text style={styles.text}>Search Result</Text>
        </Header>
        {!loading ? (
          <FlatList
            data={listMaterial.length > 0 ? listMaterial : mockMaterialData}
            renderItem={this._renderItem}
            keyExtractor={(item, index) => item.id.toString()}
          />
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
  itemWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderWidth: 1,
    borderColor: colors.primaryColor,
    borderRadius: 5,
    marginBottom: 15
  },
  text: {
    fontSize: fontSize.bodyText,
    fontWeight: "500"
  },
  caption: {
    fontSize: fontSize.caption,
    fontWeight: "500"
  }
});

export default MaterialResult;
