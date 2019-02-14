import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal
} from "react-native";
import { SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import { Feather } from "@expo/vector-icons";
import { searchEquipment } from "../../redux/actions/equipment";

import Header from "../../components/Header";
import Loading from "../../components/Loading";
import EquipmentItem from "../MyEquipment/components/EquipmentItem";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

@connect(
  state => ({
    equipment: state.equipment.list
  }),
  dispatch => ({
    fetchSearchEquipment: (address, long, lat, beginDate, endDate) => {
      dispatch(searchEquipment(address, long, lat, beginDate, endDate));
    }
  })
)
class SearchResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false
    };
  }

  _setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  _findResultByAddress = equipment => {
    //Query response: main_text & secondary_text
    const { query, lat, long } = this.props.navigation.state.params;
    const result = equipment.filter(
      item => item.address === query.main_text && item.status === "AVAILABLE"
    );
    return result ? result : equipment;
  };

  render() {
    const { equipment } = this.props;
    const { query } = this.props.navigation.state.params;
    const result = this._findResultByAddress(equipment);
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "always", top: "always" }}
      >
        <Header
          renderRightButton={() => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity style={{ marginRight: 10 }}>
                <Feather name="shopping-cart" size={24} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this._setModalVisible(true);
                }}
              >
                <Feather name="search" size={24} />
              </TouchableOpacity>
            </View>
          )}
          renderLeftButton={() => (
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Feather name="arrow-left" size={24} />
            </TouchableOpacity>
          )}
        >
          <Text style={styles.title}>{query.main_text}</Text>
        </Header>

        {equipment ? (
          <View style={{ flex: 1, paddingHorizontal: 15 }}>
            <FlatList
              data={result}
              renderItem={({ item, index }) => (
                <EquipmentItem
                  onPress={() =>
                    this.props.navigation.navigate("Detail", { id: item.id })
                  }
                  key={`eq_${index}`}
                  id={item.id}
                  name={item.name}
                  imageURL={
                    "https://www.extremesandbox.com/wp-content/uploads/Extreme-Sandbox-Corportate-Events-Excavator-Lifting-Car.jpg"
                  }
                  status={item.status}
                  price={item.dailyPrice}
                />
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
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
  title: {
    fontSize: fontSize.h4,
    fontWeight: "600"
  }
});

export default SearchResult;
