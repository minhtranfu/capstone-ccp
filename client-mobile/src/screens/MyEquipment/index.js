import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity
} from "react-native";
import { SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import { AntDesign } from "@expo/vector-icons";

import { removeEquipment } from "../../redux/actions/equipment";
import ParallaxList from "../../components/ParallaxList";
import CustomModal from "../../components/CustomModal";
import Button from "../../components/Button";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

const { width, height } = Dimensions.get("window");

@connect(
  state => {
    console.log(state.equipment.equipment);
    return {
      equipment: state.equipment.equipment
    };
  },
  dispatch => ({
    fetchRemoveEquipment: id => {
      dispatch(removeEquipment(id));
    }
  })
)
class MyEquipment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: ""
    };
  }

  renderScrollItem = () => {
    const { equipment } = this.props;
    return (
      <View style={styles.scrollWrapper}>
        <Text>Listing</Text>
        {equipment.length > 0 ? (
          <View>
            <CustomModal
              label={"Status"}
              onSelectValue={value => this.setState({ status: value })}
            />
            {equipment.map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <Text>{item.name}</Text>
                <TouchableOpacity
                  onPress={() => this.props.fetchRemoveEquipment(item.id)}
                >
                  <Text>Remove</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <Text>No Data</Text>
        )}
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={() => this.props.navigation.navigate("AddDetail")}
        >
          <AntDesign name={"plus"} size={20} />
          <Text>List another equipment</Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "never", top: "always" }}
      >
        <ParallaxList
          title={"Equipment"}
          opacity={1}
          removeTitle={true}
          hasLeft={false}
          hasAdd={true}
          onRightPress={() => this.props.navigation.navigate("AddDetail")}
          scrollElement={<Animated.ScrollView />}
          renderScrollItem={this.renderScrollItem}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollWrapper: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: 15
  }
});

export default MyEquipment;
