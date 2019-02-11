import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  Button,
  TouchableOpacity,
  SegmentedControlIOS,
  ScrollView,
  FlatList
} from "react-native";
import { SafeAreaView } from "react-navigation";
import { Feather } from "@expo/vector-icons";
import { connect } from "react-redux";
import { listEquipmentByRequesterId } from "../../redux/actions/equipment";

import { isSignedIn } from "../../config/auth";
import RequireLogin from "../Login/RequireLogin";
import Loading from "../../components/Loading";
import Header from "../../components/Header";
import EquipmentItem from "../MyEquipment/components/EquipmentItem";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

@connect(
  state => {
    return {
      auth: state.auth.userIsLoggin,
      equipment: state.equipment.list,
      requesterEquipment: state.equipment.listRequesterEquipment
    };
  },
  dispatch => ({
    fetchRequesterEquipment: id => {
      dispatch(listEquipmentByRequesterId(id));
    }
  })
)
class Activity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signedIn: false,
      checkedSignIn: false,
      selectedIndex: 0
    };
  }

  componentDidMount() {
    this.props.fetchRequesterEquipment(12);
  }

  _handleFilterStatusResult = status => {
    const { requesterEquipment } = this.props;
    const result = requesterEquipment.data.filter(
      item => item.status === status
    );
    return result;
  };

  renderHiredSreen = () => {
    return (
      <View>
        <FlatList
          data={this._handleFilterResult("ACCEPTED")}
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
    );
  };

  renderPendingScreen = () => {};

  renderScrollItem = () => {
    const { selectedIndex } = this.state;
    const { requesterEquipment } = this.props;
    if (requesterEquipment.data.length > 0) {
      switch (selectedIndex) {
        case 0:
          return this.renderHiredSreen();
        case 1:
          return this.renderPendingScreen();
      }
    } else {
      return (
        <View>
          <Text>No Data</Text>
        </View>
      );
    }
  };

  render() {
    const { checkedSignIn, signedIn } = this.state;
    const { navigation, auth, requesterEquipment } = this.props;
    console.log("Activity", auth);

    if (auth) {
      return (
        <SafeAreaView
          style={styles.container}
          forceInset={{ bottom: "never", top: "always" }}
        >
          {requesterEquipment ? (
            <View>
              <Header
                renderRightButton={() => (
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate("Notification")
                    }
                  >
                    <Feather name="bell" size={24} />
                  </TouchableOpacity>
                )}
              >
                <SegmentedControlIOS
                  style={{ width: 300 }}
                  values={["Hired", "Pending"]}
                  selectedIndex={this.state.selectedIndex}
                  onChange={event => {
                    this.setState({
                      selectedIndex: event.nativeEvent.selectedSegmentIndex
                    });
                  }}
                  tintColor={colors.primaryColor}
                />
              </Header>

              <ScrollView>{this.renderScrollItem()}</ScrollView>
            </View>
          ) : (
            <Loading />
          )}
        </SafeAreaView>
      );
    } else {
      return <RequireLogin navigation={navigation} />;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});

export default Activity;
