import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity
} from "react-native";
import { SafeAreaView } from "react-navigation";
import { ImagePicker, Permissions } from "expo";

import CustomModal from "../../components/CustomModal";
import InputField from "../../components/InputField";
import Title from "../../components/Title";
import Button from "../../components/Button";
import ParallaxList from "../../components/ParallaxList";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

const config = {
  image: "https://ak4.picdn.net/shutterstock/videos/6731134/thumb/1.jpg"
};

class AddEquipment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      equipmentImage: config.image,
      pickerValue: "Select an option",
      modalVisible: false
    };
  }

  handleChangeValuePicker = itemValue => {
    this.setState({ pickerValue: itemValue });
  };

  setModalVisible = visible => {
    this.setState({ modalVisible: visible });
  };

  renderScrollItem = () => {
    return (
      <View>
        <Text style={{ marginLeft: 15, marginBottom: 15 }}>
          First, let's narrow things down
        </Text>
        <InputField
          label={"Equipment Name"}
          placeholder={"Input your equipment name"}
          labelTextSize={fontSize.secondaryText}
          labelColor={colors.secondaryColor}
          textColor={colors.secondaryColorOpacity}
          borderBottomColor={colors.secondaryColorOpacity}
          inputType="text"
          customWrapperStyle={{ marginBottom: 30, marginHorizontal: 15 }}
        />
        <InputField
          label={"Equipment Name"}
          placeholder={"Input your equipment name"}
          labelTextSize={fontSize.secondaryText}
          labelColor={colors.secondaryColor}
          textColor={colors.secondaryColorOpacity}
          borderBottomColor={colors.secondaryColorOpacity}
          inputType="text"
          customWrapperStyle={{ marginBottom: 30, marginHorizontal: 15 }}
        />

        <CustomModal label={"Select your categories"} />
        <CustomModal label={"Select your types"} />

        <InputField
          label={"Equipment Name"}
          placeholder={"Input your equipment name"}
          labelTextSize={fontSize.secondaryText}
          labelColor={colors.secondaryColor}
          textColor={colors.secondaryColorOpacity}
          borderBottomColor={colors.secondaryColorOpacity}
          inputType="text"
          customWrapperStyle={{ marginBottom: 30, marginHorizontal: 15 }}
        />
        <InputField
          label={"Equipment Name"}
          placeholder={"Input your equipment name"}
          labelTextSize={fontSize.secondaryText}
          labelColor={colors.secondaryColor}
          textColor={colors.secondaryColorOpacity}
          borderBottomColor={colors.secondaryColorOpacity}
          inputType="text"
          customWrapperStyle={{ marginBottom: 30, marginHorizontal: 15 }}
        />

        <TouchableOpacity>
          <Text>Next</Text>
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
          title={"Post Equipment"}
          hasLeft={false}
          hasClose={true}
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
  buttonStyle: {
    backgroundColor: "grey",
    borderRadius: 5,
    height: 100
  },
  titleStyle: {
    fontSize: fontSize.secondaryText
  }
});

export default AddEquipment;
