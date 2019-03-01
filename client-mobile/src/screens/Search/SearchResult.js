import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert
} from "react-native";
import { SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import { Feather } from "@expo/vector-icons";
import {
  searchEquipment,
  clearSearchResult
} from "../../redux/actions/equipment";

import Header from "../../components/Header";
import Loading from "../../components/Loading";
import EquipmentItem from "../MyTransaction/components/EquipmentItem";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

const ITEM_HEIGHT = 217;

@connect(
  state => ({
    status: state.status,
    loading: state.equipment.loading,
    listSearch: state.equipment.listSearch
  }),
  dispatch => ({
    fetchSearchEquipment: (address, long, lat, beginDate, endDate) => {
      dispatch(searchEquipment(address, long, lat, beginDate, endDate));
    },
    fetchClearSearchEquipment: () => {
      dispatch(clearSearchResult());
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

  componentDidMount() {
    const { query, lat, long } = this.props.navigation.state.params;
    const fullAddress = query.main_text.concat(", ", query.secondary_text);
    this.props.fetchSearchEquipment(query.main_text, lat, long);
  }

  shouldComponentUpdate(nextProps) {
    const { status } = this.props;
    if (status.message !== nextProps.status.message) return true;
    return false;
  }

  componentDidUpdate(prevProps) {
    const { status, navigation } = this.props;
    if (status.type === "error" && navigation.state.routeName === "Result") {
      this._showAlert("Error", this.props.status.message);
    }
    if (status.type === "success" && navigation.state.routeName === "Result") {
      this._showAlert("Success", this.props.status.message);
    }
  }

  _showAlert = (title, msg) => {
    Alert.alert(title, msg, [{ text: "OK" }], {
      cancelable: true
    });
  };

  // componentWillUnmount() {
  //   this.props.fetchClearSearchEquipment();
  // }

  _setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  // _findResultByAddress = equipment => {
  //   //Query response: main_text & secondary_text
  //   const { query, lat, long } = this.props.navigation.state.params;
  //   const result = equipment.filter(
  //     item =>
  //       item.address === query.main_text.concat(", ", query.secondary_text) &&
  //       item.status === "AVAILABLE"
  //   );
  //   return result ? result : equipment;
  // };

  _renderItem = ({ item }) => (
    <EquipmentItem
      onPress={() =>
        this.props.navigation.navigate("SearchDetail", {
          id: item.equipmentEntity.id
        })
      }
      key={`eq_${item.equipmentEntity.id}`}
      id={item.equipmentEntity.id}
      name={item.equipmentEntity.name}
      imageURL={
        "https://www.extremesandbox.com/wp-content/uploads/Extreme-Sandbox-Corportate-Events-Excavator-Lifting-Car.jpg"
      }
      address={item.equipmentEntity.address}
      price={item.equipmentEntity.dailyPrice}
    />
  );

  render() {
    const { listSearch, loading } = this.props;
    const { query } = this.props.navigation.state.params;
    //const result = this._findResultByAddress(equipment);
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
              <Feather name="arrow-left" size={24} />
            </TouchableOpacity>
          )}
          renderRightButton={() => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity style={{ marginRight: 10 }}>
                <Feather name="shopping-cart" size={24} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.push("Search");
                }}
              >
                <Feather name="search" size={24} />
              </TouchableOpacity>
            </View>
          )}
        >
          <Text style={styles.title}>{query.main_text}</Text>
        </Header>

        {listSearch ? (
          <FlatList
            style={{ flex: 1, paddingHorizontal: 15 }}
            data={listSearch}
            renderItem={this._renderItem}
            removeClippedSubviews={false}
            keyExtractor={(item, index) => index.toString()}
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
  title: {
    fontSize: fontSize.h4,
    fontWeight: "600"
  }
});

export default SearchResult;
