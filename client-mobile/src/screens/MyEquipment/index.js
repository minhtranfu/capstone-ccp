import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import { Feather } from "@expo/vector-icons";
import {
  getContractorEquipmentList,
  removeEquipment
} from "../../redux/actions/equipment";
import {
  listTransactionBySupplierId,
  clearSupplierTransactionList
} from "../../redux/actions/transaction";

import ParallaxList from "../../components/ParallaxList";
import Dropdown from "../../components/Dropdown";
import Button from "../../components/Button";
import EquipmentItem from "../MyTransaction/components/EquipmentItem";
import EquipmentStatus from "../MyTransaction/components/EquipmentStatus";
import Header from "../../components/Header";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";
import Loading from "../../components/Loading";

const { width, height } = Dimensions.get("window");

const EQUIPMENT_STATUSES = [
  {
    code: "AVAILABLE",
    title: "Available"
  },
  {
    code: "ACCEPTED",
    title: "Accepted"
  },
  {
    code: "DELIVERING",
    title: "Delivering"
  },
  {
    code: "RENTING",
    title: "Renting" // On Waiting,
  },
  {
    code: "WAITING_FOR_RETURNING",
    title: "Waiting for returning"
  },
  {
    code: "DENIED",
    title: "Denied"
  }
];

const DROPDOWN_OPTIONS = [
  {
    id: 0,
    name: "All Statuses",
    value: "all"
  },
  {
    id: 1,
    name: "Available",
    value: "AVAILABLE"
  },
  {
    id: 2,
    name: "Delivered",
    value: "DELIVERED"
  },
  {
    id: 3,
    name: "Pending",
    value: "PENDING"
  },
  {
    id: 4,
    name: "Accepted",
    value: "ACCEPTED"
  },
  {
    id: 5,
    name: "Denied",
    value: "DENIED"
  },
  {
    id: 6,
    name: "Waiting to returning",
    value: "waiting"
  }
];

@connect(
  state => {
    return {
      list: state.equipment.contractorEquipment,
      myTransaction: state.transaction.listSupplierTransaction,
      transactionStatus: state.transaction.transactionStatus,
      detail: state.transaction.transactionDetail,
      message: state.status.message
    };
  },
  dispatch => ({
    fetchRemoveEquipment: id => {
      dispatch(removeEquipment(id));
    },
    fetchContractorEquipment: id => {
      dispatch(getContractorEquipmentList(id));
    },
    fetchClearMyTransaction: () => {
      dispatch(clearSupplierTransactionList());
    }
  })
)
class MyEquipment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "",
      loading: true,
      id: null,
      transactionStatus: ""
    };
  }

  componentDidMount() {
    this.props.fetchContractorEquipment(13);
  }

  componentDidUpdate(prevProps, prevState) {
    const { list } = this.props;
    // const { id } = this.state;
    if (prevProps.list && list.length !== prevProps.list.length) {
      this.props.fetchContractorEquipment(13);
    }
  }

  _handleOnPressItem = id => {
    this.setState({ id });
  };

  _handleOnNavigateBack = transactionStatus => {
    this.setState({ transactionStatus });
  };

  _handleAddButton = () => {
    this.props.navigation.navigate("AddDetail");
  };

  _getEquipementByStatus = status => {
    const { list } = this.props;
    return list.filter(item => item.status === status) || [];
  };

  _renderContent = () => {
    const { list, message } = this.props;
    return (
      <View style={styles.scrollWrapper}>
        {list.length > 0 ? (
          <View>
            <Dropdown
              label={"Filter"}
              defaultText={"All Statuses"}
              onSelectValue={value => this.setState({ status: value })}
              options={DROPDOWN_OPTIONS}
              isHorizontal={true}
            />
            <View>
              {EQUIPMENT_STATUSES.map((status, idx) => {
                const equipmentList = this._getEquipementByStatus(status.code);
                //Hide section if there is no equipment
                if (equipmentList.length === 0) return null;

                // Otherwise, display the whole list
                return (
                  <View key={`sec_${idx}`}>
                    <EquipmentStatus
                      count={equipmentList.length}
                      title={status.title}
                      code={status.code}
                    />
                    {equipmentList.map((item, index) => (
                      <EquipmentItem
                        onPress={() => {
                          this._handleOnPressItem(item.id);
                          this.props.navigation.navigate("MyEquipmentDetail", {
                            id: item.id
                          });
                        }}
                        key={`eq_${index}`}
                        id={item.id}
                        name={item.name}
                        imageURL={
                          "https://www.extremesandbox.com/wp-content/uploads/Extreme-Sandbox-Corportate-Events-Excavator-Lifting-Car.jpg"
                        }
                        address={item.address}
                        requesterThumbnail={item.thumbnailImage}
                        price={item.dailyPrice}
                      />
                    ))}
                  </View>
                );
              })}
            </View>
          </View>
        ) : (
          <Text>No Data</Text>
        )}
      </View>
    );
  };

  render() {
    const { list } = this.props;
    const { loading } = this.state;
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "always", top: "always" }}
      >
        <Header
          renderRightButton={() => (
            <TouchableOpacity onPress={this._handleAddButton}>
              <Feather name="plus" size={22} />
            </TouchableOpacity>
          )}
        >
          <Text
            style={{
              fontSize: fontSize.h4,
              fontWeight: "500",
              color: colors.text
            }}
          >
            My Equipment
          </Text>
        </Header>
        {list ? (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.scrollContent}
          >
            {this._renderContent()}
          </ScrollView>
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
  scrollContent: {
    flex: 0,
    paddingHorizontal: 15,
    paddingTop: 20
  },
  equipmentItemContainer: {
    paddingVertical: 8
  },
  title: {
    fontSize: fontSize.h4,
    fontWeight: "600"
  }
});

export default MyEquipment;
