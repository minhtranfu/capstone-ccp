import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Alert,
  Dimensions,
  TextInput,
  Image
} from "react-native";
import { SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import { Feather } from "@expo/vector-icons";
import { searchEquipment } from "../../redux/actions/equipment";
import { addSubscription } from "../../redux/actions/subscription";
import { LinearGradient } from "expo";

import Header from "../../components/Header";
import Loading from "../../components/Loading";
import EquipmentItem from "../../components/EquipmentItem";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";
import { bindActionCreators } from "redux";
import moment from "moment";

const ITEM_HEIGHT = 217;
const width = Dimensions.get("window").width;

@connect(
  state => ({
    status: state.status,
    loading: state.equipment.searchLoading,
    listSearch: state.equipment.listSearch,
    generalType: state.type.listGeneralEquipmentType
  }),
  dispatch =>
    bindActionCreators({ fetchSearchEquipment: searchEquipment }, dispatch)
)
class EquipmentResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      filterModalVisible: false,
      calendarVisible: false,
      beginDate: null,
      endDate: null,
      offset: 0,
      loadMore: false
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const nextParams = nextProps.navigation.state.params;
    if (
      nextParams.beginDate !== prevState.beginDate ||
      nextParams.endDate !== prevState.endDate
    ) {
      return {
        beginDate: nextParams.beginDate,
        endDate: nextParams.endDate
      };
    }
    return null;
  }

  componentDidMount() {
    const { equipment, searchParams } = this.props.navigation.state.params;
    const { offset } = this.state;
    this.props.fetchSearchEquipment(searchParams, offset);
  }

  _showAlert = (title, msg) => {
    Alert.alert(title, msg, [{ text: "OK" }], {
      cancelable: true
    });
  };

  _handleSearchMore = async () => {
    const { equipment } = this.props.navigation.state.params;
    await this.props.fetchSearchEquipment(equipment, this.state.offset);
    this.setState({ loadMore: false });
  };

  _handleLoadMore = async () => {
    const { listSearch } = this.props;
    const { offset, loadMore } = this.state;
    if (listSearch.length >= offset) {
      this.setState(
        {
          offset: offset + 10,
          loadMore: true
        },
        () => {
          this._handleSearchMore();
        }
      );
    }
  };

  _renderFooter = () => {
    if (!this.state.loadMore) return null;
    return <Loading />;
  };

  _renderItem = ({ item }) => {
    const { equipment, query } = this.props.navigation.state.params;
    //console.log(query);
    return (
      <EquipmentItem
        onPress={() =>
          this.props.navigation.navigate("SearchDetail", {
            id: item.equipmentEntity.id,
            beginDate: equipment.beginDate,
            endDate: equipment.endDate,
            query
          })
        }
        key={`eq_${item.equipmentEntity.id}`}
        id={item.equipmentEntity.id}
        name={item.equipmentEntity.name}
        contractor={item.equipmentEntity.contractor.name}
        timeRange={item.equipmentEntity.availableTimeRanges[0]}
        imageURL={
          item.equipmentEntity.thumbnailImage
            ? item.equipmentEntity.thumbnailImage.url
            : "https://www.extremesandbox.com/wp-content/uploads/Extreme-Sandbox-Corportate-Events-Excavator-Lifting-Car.jpg"
        }
        rating={item.equipmentEntity.contractor.averageEquipmentRating}
        address={item.equipmentEntity.address}
        price={item.equipmentEntity.dailyPrice}
      />
    );
  };

  _renderAddSubscription = () => {
    const { equipment } = this.props.navigation.state.params;
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Image
          source={require("../../../assets/images/air-plane.png")}
          resizeMode={"contain"}
          style={{ width: 100, height: 100, marginBottom: 15 }}
        />
        <Text
          style={{
            textAlign: "center",
            marginBottom: 5,
            fontSize: fontSize.bodyText,
            fontWeight: "500",
            color: colors.primaryColor
          }}
        >
          Oops! No equipment available.
        </Text>
        <Text
          style={{
            textAlign: "center",
            marginBottom: 5,
            fontSize: fontSize.secondaryText,
            fontWeight: "500",
            color: colors.primaryColor
          }}
        >
          Please subscribe and we will notify to you when it is available
        </Text>
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate("AddSubscription", { equipment })
          }
          style={{
            backgroundColor: "transparent",
            marginTop: 50
          }}
        >
          <LinearGradient
            colors={["#F2E5A0", "#F2D06B", "#F2B33D", "#F29B30", "#D97B29"]}
            start={[0.3, 0.2]}
            style={{
              height: 40,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 20,
              paddingHorizontal: 15
            }}
          >
            <Text
              style={{
                color: colors.primaryColor,
                fontSize: fontSize.bodyText,
                fontWeight: "500"
              }}
            >
              Add subscription
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  };

  _renderHeader = () => {
    const { listSearch } = this.props;
    const { equipment } = this.props.navigation.state.params;
    return (
      <View
        style={{
          backgroundColor: "white",
          marginHorizontal: -15,
          paddingHorizontal: 15,
          paddingTop: 0,
          paddingBottom: 10
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <Text style={styles.largeTitle}>{`${listSearch.length ||
            0} Results`}</Text>
          <TouchableOpacity>
            <Text>Filter</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            backgroundColor: colors.gray,
            borderRadius: 10,
            padding: 15,
            alignItems: "center"
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.text} numberOfLines={1}>
              {`${equipment.q}`}
            </Text>
            <Text style={styles.caption}>
              {equipment.beginDate + " - " + equipment.endDate}
            </Text>
            <Text style={styles.caption}>
              {`${equipment.equipmentCat ||
                "Any caterogy"} ▶ ${equipment.equipmentType || "Any type"}`}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.goBack();
            }}
          >
            <Text
              style={{
                color: colors.secondaryColor,
                fontWeight: "600",
                marginLeft: 8
              }}
            >
              Refine
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  render() {
    const { listSearch, loading } = this.props;
    const { equipment } = this.props.navigation.state.params;

    return (
      <SafeAreaView style={styles.container} forceInset={{ top: "always" }}>
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
        />

        {!loading ? (
          <View style={{ flex: 1 }}>
            {listSearch.length > 0 ? (
              <FlatList
                ListHeaderComponent={this._renderHeader}
                stickyHeaderIndices={[0]}
                contentContainerStyle={{ paddingHorizontal: 15 }}
                data={listSearch}
                extraData={this.state}
                renderItem={this._renderItem}
                getItemLayout={(data, index) => ({
                  length: ITEM_HEIGHT,
                  offset: ITEM_HEIGHT * index,
                  index
                })}
                keyExtractor={(item, index) => index.toString()}
                ListFooterComponent={this._renderFooter}
                onEndReachedThreshold={0.2}
                onEndReached={this._handleLoadMore}
              />
            ) : (
              this._renderAddSubscription()
            )}
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
  },
  caption: {
    fontSize: fontSize.caption,
    color: colors.text68,
    fontWeight: "500",
    marginTop: 3
  },
  text: {
    fontSize: fontSize.secondaryText,
    color: colors.text,
    fontWeight: "600",
    marginBottom: 3
  },
  largeTitle: {
    alignItems: "center",
    color: colors.primaryColor,
    fontSize: fontSize.h2,
    fontWeight: "700",
    marginBottom: 5
  }
});

export default EquipmentResult;
