import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Animated,
  Picker,
  Modal,
  TouchableHighlight
} from "react-native";
import { SafeAreaView } from "react-navigation";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";

import ParallaxList from "../../components/ParallaxList";
import EquipmentItem from "./components/EquipmentItem";
import ModalFilter from "./components/ModalFilter";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

const { height, width } = Dimensions.get("window");

class Equipment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pickerValue: "Select an option",
      modalVisible: false,
      tabIndex: 0,
      routes: [
        { key: "first", title: "Supplier" },
        { key: "second", title: "Requester" }
      ]
    };
  }

  handleChangeValuePicker = itemValue => {
    this.setState({ pickerValue: itemValue });
  };

  setModalVisible = visible => {
    this.setState({ modalVisible: visible });
  };

  renderSupplierScreen = () => (
    <View style={styles.scene}>
      <TouchableHighlight
        onPress={() => {
          this.setModalVisible(true);
        }}
        style={{
          width: 150,
          height: 50,
          marginLeft: 15,
          padding: 10,
          borderWidth: 1,
          borderColor: colors.secondaryColor,
          borderRadius: 5
        }}
      >
        <Text>{this.state.pickerValue}</Text>
      </TouchableHighlight>

      <ModalFilter
        modalVisible={this.state.modalVisible}
        setModalVisible={data => this.setModalVisible(data)}
      />

      <EquipmentItem />
      <EquipmentItem />
      <EquipmentItem />
      <EquipmentItem />
      <EquipmentItem />
    </View>
  );
  renderRequesterScreen = () => (
    <View
      style={[styles.scene, { alignItems: "center", justifyContent: "center" }]}
    >
      <Text>Nothing to show</Text>
    </View>
  );

  renderScrollItem = () => {
    return (
      <View style={styles.scene}>
        <TabView
          navigationState={{
            index: this.state.tabIndex,
            routes: this.state.routes
          }}
          renderScene={SceneMap({
            first: this.renderSupplierScreen,
            second: this.renderRequesterScreen
          })}
          onIndexChange={tabIndex => this.setState({ tabIndex })}
          initialLayout={{
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height
          }}
        />
      </View>
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.container} forceInset={{ bottom: "never" }}>
        <ParallaxList
          title={"Equipment"}
          opacity={1}
          removeTitle={true}
          hasLeft={false}
          hasAdd={true}
          onPress={() => this.props.navigation.navigate("AddEquipment")}
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
  scene: {
    flex: 2
  },
  titleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderBottomWidth: 0.5,
    borderColor: colors.grayWhite,
    paddingBottom: 10
  }
});

export default Equipment;
