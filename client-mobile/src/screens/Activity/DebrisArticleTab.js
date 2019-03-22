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
import AddModal from "../MyEquipment/components/AddModal";
import Dropdown from "../../components/Dropdown";
import Button from "../../components/Button";

import { COLORS } from "../../Utils/Constants";
import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

class DebrisArticleTab extends Component {
  _renderEmptyComponent = () => (
    <View style={styles.actionWrapper}>
      <Text style={styles.text}>No data</Text>
    </View>
  );

  _renderDebris = listArticle => (
    <View style={{ flex: 1 }}>
      {listArticle.map(item => (
        <DebrisItem
          key={item.id}
          title={item.title}
          address={item.address}
          debrisBids={item.debrisBids}
          debrisServiceTypes={item.debrisServiceTypes}
          onPress={() =>
            this.props.navigation.navigate("DebrisArticleDetail", {
              id: item.id
            })
          }
        />
      ))}
    </View>
  );

  render() {
    const { listDebrisArticle } = this.props;
    return (
      <View style={styles.container}>
        {listDebrisArticle.length > 0
          ? this._renderDebris(listDebrisArticle)
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
    borderColor: "#DEE4E3",
    height: 300
  },
  text: {
    fontSize: fontSize.bodyText,
    fontWeight: "500",
    color: "black"
  }
});

export default withNavigation(DebrisArticleTab);
