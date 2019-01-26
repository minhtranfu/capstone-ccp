import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView
} from "react-native";
import { SafeAreaView } from "react-navigation";
import { ImagePicker, Permissions } from "expo";
import { AntDesign } from "@expo/vector-icons";

import CustomModal from "../../../components/CustomModal";
import InputField from "../../../components/InputField";
import Title from "../../../components/Title";
import Button from "../../../components/Button";
import ParallaxList from "../../../components/ParallaxList";

import colors from "../../../config/colors";
import fontSize from "../../../config/fontSize";

const { width } = Dimensions.get("window");

const config = {
  image: "https://ak4.picdn.net/shutterstock/videos/6731134/thumb/1.jpg"
};

class AddEquipment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      equipmentImage: config.image,
      pickerValue: "Select an option",
      name: null,
      weight: null,
      type: null,
      generalType: null,
      color: null
    };
  }

  isNextEnabled = () => {
    const { name, weight, type, generalType, color } = this.state;
    if (name && weight && type && generalType && color) {
      return false;
    }
    return true;
  };

  handleChangeValuePicker = itemValue => {
    this.setState({ pickerValue: itemValue });
  };

  render() {
    const { name, weight, type, generalType, color } = this.state;
    const disable = this.isNextEnabled();
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "never", top: "always" }}
      >
        <View style={styles.topWrapper}>
          <TouchableOpacity
            style={{ marginLeft: 15 }}
            onPress={() => this.props.navigation.goBack()}
          >
            <AntDesign name="close" size={30} />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.container}>
          <Text style={styles.title}>Post your equipment</Text>
          <InputField
            label={"Equipment Name"}
            placeholder={"Input your equipment name"}
            labelTextSize={fontSize.secondaryText}
            labelColor={colors.secondaryColor}
            textColor={colors.secondaryColor}
            placeholderTextColor={colors.secondaryColorOpacity}
            borderBottomColor={colors.secondaryColorOpacity}
            customWrapperStyle={{ marginBottom: 20, marginHorizontal: 15 }}
            inputType="text"
            onChangeText={value => this.setState({ name: value })}
            value={name}
            returnKeyType={"next"}
          />
          <InputField
            label={"Weight"}
            placeholder={"Input your equipment weight"}
            labelTextSize={fontSize.secondaryText}
            labelColor={colors.secondaryColor}
            textColor={colors.secondaryColor}
            placeholderTextColor={colors.secondaryColorOpacity}
            borderBottomColor={colors.secondaryColorOpacity}
            customWrapperStyle={{ marginBottom: 20, marginHorizontal: 15 }}
            inputType="text"
            onChangeText={value => this.setState({ weight: value })}
            value={weight}
            returnKeyType={"next"}
          />
          <InputField
            label={"Color"}
            placeholder={"Input your equipment color"}
            labelTextSize={fontSize.secondaryText}
            labelColor={colors.secondaryColor}
            textColor={colors.secondaryColor}
            placeholderTextColor={colors.secondaryColorOpacity}
            borderBottomColor={colors.secondaryColorOpacity}
            customWrapperStyle={{ marginBottom: 20, marginHorizontal: 15 }}
            inputType="text"
            onChangeText={value => this.setState({ color: value })}
            value={color}
          />
          <CustomModal
            label={"Select your categories"}
            onSelectValue={value => this.setState({ generalType: value })}
          />
          <CustomModal
            label={"Select your types"}
            onSelectValue={value => this.setState({ type: value })}
          />
        </ScrollView>
        <View style={styles.bottomWrapper}>
          <TouchableOpacity
            style={[
              styles.buttonWrapper,
              disable ? styles.buttonDisable : styles.buttonEnable
            ]}
            disabled={disable}
            onPress={() =>
              disable ? null : this.props.navigation.navigate("AddDuration")
            }
          >
            <Text style={styles.text}>Next</Text>
            <Text>></Text>
          </TouchableOpacity>
        </View>
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
  },
  topWrapper: {
    backgroundColor: colors.white,
    zIndex: 1,
    top: 0,
    alignItems: "flex-start",
    justifyContent: "center",
    height: 50
  },
  bottomWrapper: {
    backgroundColor: "transparent",
    position: "absolute",
    zIndex: 1,
    bottom: 15,
    right: 15,
    justifyContent: "center",
    alignItems: "flex-end"
  },
  title: {
    fontSize: fontSize.h3,
    color: colors.secondaryColor,
    fontWeight: "bold",
    marginLeft: 15,
    marginBottom: 20
  },
  text: {
    fontSize: fontSize.bodyText,
    fontWeight: "bold",
    color: colors.secondaryColor
  },
  buttonWrapper: {
    marginRight: 15,
    width: 80,
    height: 40,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row"
  },
  buttonEnable: {
    backgroundColor: colors.primaryColor
  },
  buttonDisable: {
    backgroundColor: "gray"
  }
});

export default AddEquipment;
