import React, { Component } from "react";
import { SafeAreaView } from "react-navigation";
import { View, Text, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { editMaterial } from "../../redux/actions/material";
import Feather from "@expo/vector-icons/Feather";

import Header from "../../components/Header";
import Loading from "../../components/Loading";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

@connect(
  (state, ownProps) => {
    const { id } = ownProps.navigation.state.params;
    return {
      materialDetail: state.material.materialList.find(item => item.id === id)
    };
  },
  dispatch => ({
    fetchUpdateMaterialDetail: (materialId, material) => {
      dispatch(editMaterial(materialId, material));
    }
  })
)
class MaterialDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "always", top: "always" }}
      >
        <Header
          renderLeftButton={() => (
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.goBack();
              }}
            >
              <Feather name="x" size={24} />
            </TouchableOpacity>
          )}
        >
          <Text style={styles.text}>Material Detail</Text>
        </Header>
        <Text> textInComponent </Text>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  text: {
    fontSize: fontSize.bodyText,
    fontWeight: "500"
  }
});

export default MaterialDetail;
