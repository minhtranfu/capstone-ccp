import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity
} from "react-native";
import { SafeAreaView, withNavigation } from "react-navigation";

import DebrisItem from "../../components/DebrisItem";
import AddModal from "../Manage/components/AddModal";
import Dropdown from "../../components/Dropdown";
import Button from "../../components/Button";

import { COLORS } from "../../Utils/Constants";
import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

class MyPostTab extends Component {
  _renderEmptyComponent = () => (
    <View style={styles.actionWrapper}>
      <Text style={styles.text}>No data</Text>
    </View>
  );

  _renderDebris = listArticle => (
    <View style={{ flex: 1 }}>
      {listArticle
        .filter(item => item.status === "PENDING")
        .map(item => (
          <DebrisItem
            key={item.id}
            title={item.title}
            address={item.address}
            debrisBids={item.debrisBids}
            debrisServiceTypes={item.debrisServiceTypes}
            onPress={() =>
              this.props.navigation.navigate("MyPostDetail", {
                id: item.id
              })
            }
          />
        ))}
    </View>
  );

  render() {
    const { listDebrisPost } = this.props;
    return (
      <View style={styles.container}>
        {listDebrisPost.length > 0
          ? this._renderDebris(listDebrisPost)
          : this._renderEmptyComponent()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  actionWrapper: {
    justifyContent: "center",
    alignItems: "center",
    height: 300,
    borderRadius: 9,
    borderStyle: "dashed",
    borderWidth: 3,
    borderColor: "#DEE4E3"
  },
  text: {
    fontSize: fontSize.bodyText,
    fontWeight: "500",
    color: "black"
  }
});

export default withNavigation(MyPostTab);
