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

import Dropdown from "../../components/Dropdown";
import EquipmentStatus from "../../components/EquipmentStatus";
import DebrisSearchItem from "../../components/DebrisSearchItem";
import Button from "../../components/Button";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

const DEBRIS_TRANSACTION_STATUSES = [
  {
    code: "ACCEPTED",
    title: "Accepted"
  },
  {
    code: "DELIVERING",
    title: "Delivering"
  },
  {
    code: "WORKING",
    title: "Wokring"
  },
  {
    code: "FINISHED",
    title: "Finished"
  },
  {
    code: "CANCEL",
    title: "Cancel"
  }
];

const DEBRIS_TRANSACTION_OPTIONS = [
  {
    id: 0,
    name: "All Statuses",
    value: "All Statuses"
  },
  {
    id: 2,
    name: "Accepted",
    value: "Accepted"
  },
  {
    id: 3,
    name: "Delivering",
    value: "Delivering"
  },
  {
    id: 4,
    name: "Working",
    value: "Working"
  },
  {
    id: 5,
    name: "Finished",
    value: "Finished"
  },

  {
    id: 6,
    name: "Cancel",
    value: "Cancel"
  }
];

class DebrisTab extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      status: "All Statuses"
    };
  }

  _handleFilter = () => {
    if (this.state.status === "All Statuses") {
      return DEBRIS_TRANSACTION_STATUSES;
    } else {
      return DEBRIS_TRANSACTION_STATUSES.filter(
        status => status.code === this.state.status.toUpperCase()
      );
    }
  };

  _renderEmptyComponent = () => (
    <View style={styles.actionWrapper}>
      <Text style={styles.text}>No data</Text>
    </View>
  );

  _renderDebrisTransaction = listDebris => (
    <View style={{ flex: 1 }}>
      {this._handleFilter().map((status, idx) => {
        const debrisList = listDebris.filter(
          item => item.status === status.code.toUpperCase()
        );
        if (debrisList.length === 0) return null;
        console.log(debrisList);
        return (
          <View key={`sec_${idx}`}>
            <EquipmentStatus
              count={debrisList.length}
              title={status.title}
              code={status.code}
            />
            {debrisList.map(item => {
              return (
                <DebrisSearchItem
                  key={item.id}
                  address={item.debrisPost.address}
                  debrisBids={item.debrisPost.debrisBids}
                  description={item.debrisPost.description}
                  title={item.debrisPost.title}
                  debrisServiceTypes={item.debrisPost.debrisServiceTypes}
                  itemUrl={
                    item.debrisPost.thumbnailImage
                      ? item.debrisPost.thumbnailImage.url
                      : "https://images1.houstonpress.com/imager/u/745xauto/9832653/dump_edit_resize.jpg"
                  }
                  onPress={() =>
                    this.props.navigation.navigate("DebrisDetail", {
                      id: item.id
                    })
                  }
                />
              );
            })}
          </View>
        );
      })}
    </View>
  );

  render() {
    const { listDebrisTransaction } = this.props;
    return (
      <View style={styles.container}>
        <Dropdown
          label={"Filter"}
          defaultText={"All Statuses"}
          onSelectValue={value => this.setState({ status: value })}
          options={DEBRIS_TRANSACTION_OPTIONS}
          isHorizontal={true}
        />
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
    borderColor: "#DEE4E3"
  },
  text: {
    fontSize: fontSize.bodyText,
    fontWeight: "500",
    color: "black"
  }
});

export default withNavigation(DebrisTab);
