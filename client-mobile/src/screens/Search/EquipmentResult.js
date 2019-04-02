import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Alert,
  Dimensions,
  TextInput
} from "react-native";
import { SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import { Feather } from "@expo/vector-icons";
import { searchEquipment } from "../../redux/actions/equipment";
import { addSubscription } from "../../redux/actions/subscription";

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
      endDate: null
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
    } else return null;
  }

  componentDidMount() {
    const {
      query,
      lat,
      long,
      beginDate,
      endDate,
      equipmentTypeId
    } = this.props.navigation.state.params;
    console.log(beginDate, endDate);
    //const fullAddress = query.main_text.concat(", ", query.secondary_text);

    this.props.fetchSearchEquipment(
      query.main_text,
      lat,
      long,
      moment(beginDate).format('YYYY-MM-DD'),
      moment(endDate).format('YYYY-MM-DD'),
      equipmentTypeId
    );
  }

  _showAlert = (title, msg) => {
    Alert.alert(title, msg, [{ text: "OK" }], {
      cancelable: true
    });
  };

  _handleAddMoreMonth = (date, month) => {
    let today = new Date(date);
    let result = today.setMonth(today.getMonth() + month);
    return result;
  };

  _onSelectDate = (fromDate, toDate, visible) => {
    const newToDate = toDate ? toDate : this._handleAddMoreMonth(fromDate, 6);
    this.setState({
      fromDate,
      toDate: this._handleDateFormat(newToDate),
      calendarVisible: visible,
      modalVisible: !visible
    });
  };

  _renderItem = ({ item }) => {
    const { query } = this.props.navigation.state.params;
    return (
      <EquipmentItem
        onPress={() =>
          this.props.navigation.navigate("SearchDetail", {
            id: item.equipmentEntity.id,
            query: query
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
        address={item.equipmentEntity.address}
        price={item.equipmentEntity.dailyPrice}
      />
    );
  };

  renderAddSubscription = () => {
    const { query, equipmentTypeId } = this.props.navigation.state.params;
    const { beginDate, endDate } = this.state;
    const subscriptionInfo = {
      beginDate: moment(beginDate).format("MM/YY"),
      endDate: moment(endDate).format("MM/YY"),
      equipmentType: {
        id: equipmentTypeId
      },
      latitude: query.lat,
      longitude: query.lng
    };

    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Text style={{ textAlign: "center", marginBottom: 5 }}>
          Not Available Equipment. Please subscribe and we will notify to you
          when it is available
        </Text>

        <View style={{ alignItems: "center", marginBottom: 10 }}>
          <Text>Location: {query.main_text}</Text>
          <Text>
            (lat: {subscriptionInfo.latitude} / lng:{" "}
            {subscriptionInfo.longitude})
          </Text>
          <Text>beginDate: {subscriptionInfo.beginDate}</Text>
          <Text>endDate: {subscriptionInfo.endDate}</Text>
          <TextInput
            placeholder={"max distance"}
            keyboardType="numeric"
            style={{
              width: 200,
              padding: 5,
              borderWidth: 0.5,
              marginBottom: 5
            }}
            ref={node => (this.maxDistance = node)}
          />
          <TextInput
            placeholder={"max price"}
            keyboardType="numeric"
            style={{
              width: 200,
              padding: 5,
              borderWidth: 0.5,
              marginBottom: 5
            }}
            ref={node => (this.maxPrice = node)}
          />

          <TouchableOpacity
            style={{
              backgroundColor: "green",
              alignItems: "center",
              width: 200,
              padding: 10
            }}
            onPress={() => {
              const info = {
                ...subscriptionInfo,
                maxDistance: parseInt(this.maxDistance._lastNativeText),
                maxPrice: parseInt(this.maxPrice._lastNativeText)
              };
              addSubscription(info).then(() => {
                this.props.navigation.navigate("Account");
              });
            }}
          >
            <Text style={{ color: "#ffffff" }}>Subscribed</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  render() {
    const { listSearch, loading } = this.props;
    const {
      query,
      beginDate,
      endDate,
      equipmentCat,
      equipmentType
    } = this.props.navigation.state.params;
    //const result = this._findResultByAddress(equipment);

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
          renderRightButton={() => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("Cart")}
              >
                <Feather
                  name="shopping-cart"
                  size={20}
                  color={colors.secondaryColor}
                  style={{ marginRight: 5 }}
                />
              </TouchableOpacity>
            </View>
          )}
        />

        {!loading ? (
          <View style={{ flex: 1 }}>
            {listSearch.length > 0 ? (
              <FlatList
                ListHeaderComponent={() => (
                  <View
                    style={{
                      backgroundColor: "white",
                      marginHorizontal: -15,
                      paddingHorizontal: 15,
                      paddingTop: 0,
                      paddingBottom: 10
                    }}
                  >
                    <Text style={styles.largeTitle}>{`${listSearch.length ||
                      0} Results`}</Text>
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
                          {`${query.main_text}`}
                        </Text>
                        <Text style={styles.caption}>
                          {moment(beginDate).format("DD MMM, YYYY") +
                            " - " +
                            moment(endDate).format("DD MMM, YYYY")}
                        </Text>
                        <Text style={styles.caption}>
                          {`${equipmentCat || "Any"} ▶ ${equipmentType ||
                            "Any"}`}
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
                )}
                stickyHeaderIndices={[0]}
                contentContainerStyle={{ paddingHorizontal: 15 }}
                data={listSearch}
                renderItem={this._renderItem}
                getItemLayout={(data, index) => ({
                  length: ITEM_HEIGHT,
                  offset: ITEM_HEIGHT * index,
                  index
                })}
                keyExtractor={(item, index) => index.toString()}
              />
            ) : (
              this.renderAddSubscription()
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
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  filterContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.4)"
  },
  modalWrapper: {
    borderRadius: 5,
    width: width,
    height: 160,
    backgroundColor: "white"
  },
  filterWrapper: {
    borderRadius: 5,
    width: width,
    height: 200,
    backgroundColor: "white",
    paddingHorizontal: 15
  },
  rowWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    paddingVertical: 10
  },
  buttonWrapper: {
    height: 40,
    alignItems: "center",
    justifyContent: "center"
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
  textDone: {
    fontWeight: "500",
    fontSize: fontSize.bodyText,
    color: colors.secondaryColor,
    paddingTop: 15,
    paddingBottom: 15
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
