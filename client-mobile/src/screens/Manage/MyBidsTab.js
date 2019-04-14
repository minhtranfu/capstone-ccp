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
import Entypo from "@expo/vector-icons/Entypo";

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
      {listBids
        .filter(item => item.status === "PENDING")
        .map(item => (
          <DebrisItem
            key={item.id}
            title={item.debrisPost.title}
            address={item.debrisPost.address}
            price={item.price}
            onPress={() =>
              this.props.navigation.navigate("MyBidsDetail", {
                id: item.id,
                postId: item.debrisPost.id
              })
            }
          />
          // <TouchableOpacity
          //   style={{
          //     flexDirection: "row",
          //     alignItems: "center",
          //     justifyContent: "space-between"
          //   }}
          //   onPress={() =>
          //     this.props.navigation.navigate("BidDetail", { id: item.id })
          //   }
          // >
          //   <View>
          //     <Text>Title</Text>
          //     <View style={{flexDirection}}>
          //     <Text>{item.price} VND</Text>
          //     </View>
          //   </View>
          //   <Feather name="arrow-right" size={24} />
          // </TouchableOpacity>
        ))}
    </View>
  );

  render() {
    const { listDebrisBids } = this.props;
    console.log(listDebrisBids);
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
    borderColor: "#DEE4E3"
  },
  text: {
    fontSize: fontSize.bodyText,
    fontWeight: "500",
    color: "black"
  }
});

export default withNavigation(MyBidsTab);
