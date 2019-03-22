import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity
} from "react-native";
import { SafeAreaView } from "react-navigation";

import DebrisItem from "../../components/DebrisItem";
import Button from "../../components/Button";

import { COLORS } from "../../Utils/Constants";
import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

class MyBidsTab extends PureComponent {
  _renderEmptyComponent = () => (
    <View style={styles.actionWrapper}>
      <Text style={styles.text}>No data</Text>
    </View>
  );

  _renderBidDebris = listBids => (
    <View style={{ flex: 1 }}>
      {listBids.map(item => (
        <DebrisItem
          key={item.id}
          title={item.title}
          address={item.address}
          debrisBids={item.debrisBids}
          debrisServiceTypes={item.debrisServiceTypes}
        />
      ))}
    </View>
  );

  render() {
    const { listDebrisBids } = this.props;
    return (
      <View style={styles.container}>
        {listDebrisBids.length > 0
          ? this._renderBidDebris(listDebrisBids)
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

export default MyBidsTab;
