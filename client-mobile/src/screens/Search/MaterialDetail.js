import React, { Component } from "react";
import { SafeAreaView } from "react-navigation";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert
} from "react-native";
import { Image } from "react-native-expo-image-cache";
import { connect } from "react-redux";
import Feather from "@expo/vector-icons/Feather";

import Button from "../../components/Button";
import Header from "../../components/Header";
import Loading from "../../components/Loading";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

const { width } = Dimensions.get("window");

@connect((state, ownProps) => {
  const { id } = ownProps.navigation.state.params;
  return {
    detail: state.material.listSearch.find(item => item.id === id)
  };
})
class MaterialDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

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
              <Feather name="chevron-left" size={24} />
            </TouchableOpacity>
          )}
        >
          <Text>Result</Text>
        </Header>
        {detail ? (
          <ScrollView>
            <Image
              uri={detail.thumbnailImageUrl}
              resizeMode={"cover"}
              style={{ width: width, height: 70 }}
            />
            <Text>{detail.manufacturer}</Text>
            <Text>{detail.name}</Text>
            <Text>{detail.price}</Text>
            <Button
              text={"Book"}
              onPress={() =>
                this.props.navigation.navigate("ConfirmMaterial", {
                  material: detail
                })
              }
            />
          </ScrollView>
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

export default MaterialDetail;
