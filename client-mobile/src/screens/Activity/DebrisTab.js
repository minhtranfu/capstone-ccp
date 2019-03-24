import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity
} from "react-native";
import { SafeAreaView, withNavigation } from "react-navigation";
import Feather from "@expo/vector-icons/Feather";

import DebrisSearchItem from "../../components/DebrisSearchItem";
import Button from "../../components/Button";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

class DebrisTab extends PureComponent {
  _renderEmptyComponent = () => (
    <View style={styles.actionWrapper}>
      <Text style={styles.text}>No data</Text>
    </View>
  );

  _renderDebrisTransaction = listDebris => (
    <View style={{ flex: 1 }}>
      {listDebris.map(item => (
        <DebrisSearchItem
          key={item.id}
          address={item.debrisPost.address}
          debrisBids={item.debrisPost.debrisBids}
          description={item.debrisPost.description}
          title={item.debrisPost.title}
          debrisServiceTypes={item.debrisPost.debrisServiceTypes}
          itemUrl={
            item.debrisPost.debrisImages.length > 0
              ? item.debrisPost.debrisImages[0]
              : "https://images1.houstonpress.com/imager/u/745xauto/9832653/dump_edit_resize.jpg"
          }
          onPress={() =>
            this.props.navigation.navigate("DebrisDetail", { id: item.id })
          }
        />
      ))}
    </View>
  );

  render() {
    const { listDebrisTransaction } = this.props;
    return (
      <View style={styles.container}>
        {listDebrisTransaction.length > 0
          ? this._renderDebrisTransaction(listDebrisTransaction)
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

export default withNavigation(DebrisTab);
