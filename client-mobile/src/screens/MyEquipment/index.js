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
import { removeEquipment } from "../../redux/actions/equipment";
import {
  listTransactionBySupplierId,
  clearSupplierTransactionList
} from "../../redux/actions/transaction";

import ParallaxList from "../../components/ParallaxList";
import Dropdown from "../../components/Dropdown";
import Button from "../../components/Button";
import EquipmentItem from "./components/EquipmentItem";
import EquipmentStatus from "./components/EquipmentStatus";
import Header from "../../components/Header";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";
import Loading from "../../components/Loading";

const { width, height } = Dimensions.get("window");

const EQUIPMENT_STATUSES = [
  {
    code: "PENDING",
    title: "Pending" // On Waiting,
  },
  {
    code: "DELIVERED",
    title: "Delivered"
  },
  {
    code: "AVAILABLE",
    title: "Available"
  },
  {
    code: "ACCEPTED",
    title: "Accepted"
  },
  {
    code: "DENIED",
    title: "Denied"
  },
  {
    code: "WAITING_FOR_RETURNING",
    title: "Waiting for returning"
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
      equipment: state.equipment.list,
      myEquipment: state.transaction.listSupplierTransaction,
      tranactionStatus: state.transaction.tranactionStatus,
      detail: state.tranaction.tranactionDetail,
      message: state.status.message
    };
  },
  dispatch => ({
    fetchRemoveEquipment: id => {
      dispatch(removeEquipment(id));
    },
    fetchListMyEquipment: id => {
      dispatch(listEquipmentBySupplierId(id));
    },
    fetchClearMyEquipment: () => {
      dispatch(clearSupplierTransactionList());
    }
  })
)
class MyEquipmentScreen extends Component {
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
    this.props.fetchListMyEquipment(12);
  }

  componentDidUpdate(prevProps) {
    const { myEquipment, tranactionStatus, detail } = this.props;
    if (
      myEquipment.data &&
      prevProps.myEquipment.data &&
      myEquipment.data.length !== prevProps.myEquipment.data.length
    ) {
      this.props.fetchListMyEquipment(12);
    }
    if (
      detail.data &&
      detail.data.id === transactionStatus.data.id &&
      transactionStatus.data.status !== prevProps.data.staus
    ) {
      this.props.fetchListMyEquipment(12);
    }
  }

  _getIdByPress = id => {
    this.setState({ id });
  };

  _handleOnNavigateBack = transactionStatus => {
    this.setState({ transactionStatus });
  };

  _handleAddPress = () => {
    this.props.navigation.navigate("AddDetail");
  };

  _getEquipementByStatus = status => {
    const { myEquipment } = this.props;
    return myEquipment.data.filter(item => item.status === status) || [];
  };

  _renderContent = () => {
    const { myEquipment, message } = this.props;
    console.log(message);
    return (
      <View style={styles.scrollWrapper}>
        {myEquipment.data.length > 0 ? (
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
                          this._getIdByPress(item.id);
                          this.props.navigation.navigate("MyEquipmentDetail", {
                            id: item.id,
                            onNavigateBack: this._handleOnNavigateBack
                          });
                        }}
                        key={`eq_${index}`}
                        id={item.id}
                        name={item.equipment.name}
                        imageURL={
                          "https://www.extremesandbox.com/wp-content/uploads/Extreme-Sandbox-Corportate-Events-Excavator-Lifting-Car.jpg"
                        }
                        address={item.equipmentAddress}
                        requesterThumbnail={item.requester.thumbnailImage}
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
    const { myEquipment } = this.props;
    const { loading } = this.state;
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "always", top: "always" }}
      >
        <Header
          renderRightButton={() => (
            <TouchableOpacity onPress={this._handleAddPress}>
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
        {myEquipment && myEquipment.data ? (
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

export default MyEquipmentScreen;
