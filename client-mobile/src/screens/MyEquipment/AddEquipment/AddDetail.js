import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView
} from "react-native";
import { SafeAreaView, NavigationActions } from "react-navigation";
import { ImagePicker, Permissions } from "expo";
import { AntDesign, Ionicons, Feather } from "@expo/vector-icons";
import Header from "../../../components/Header";

import Dropdown from "../../../components/Dropdown";
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

const DROPDOWN_TYPES_OPTIONS = [
  {
    id: 0,
    name: "Select your type",
    value: "all"
  },
  {
    id: 1,
    name: "Xe Lu",
    value: "xe lu"
  },
  {
    id: 2,
    name: "Xe UI",
    value: "xe ui"
  }
];

const DROPDOWN_CATEGORIES_OPTIONS = [
  {
    id: 0,
    name: "Select your categories",
    value: "all"
  },
  {
    id: 1,
    name: "Xe",
    value: "xe"
  },
  {
    id: 2,
    name: "May Moc",
    value: "maymoc"
  }
];

class AddDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      equipmentImage: config.image,
      pickerValue: "Select an option",
      name: null,
      dailyPrice: null,
      type: null,
      categories: null,
      deliveryPrice: null
    };
  }

  isNextEnabled = () => {
    const { name, dailyPrice, type, categories, deliveryPrice } = this.state;
    if (name && dailyPrice && type && categories && deliveryPrice) {
      return false;
    }
    return true;
  };

  handleChangeValuePicker = itemValue => {
    this.setState({ pickerValue: itemValue });
  };

  handlePassValue = () => {
    const { name, dailyPrice, type, categories, deliveryPrice } = this.state;

    const data = {
      name: name,
      dailyPrice: dailyPrice,
      deliveryPrice: deliveryPrice,
      type: type,
      categories: categories
    };
    return data;
  };

  render() {
    const { name, dailyPrice, type, generalType, deliveryPrice } = this.state;
    const disable = this.isNextEnabled();
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "always", top: "always" }}
      >
        <Header
          renderLeftButton={() => (
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.dispatch(NavigationActions.back())
              }
            >
              <Feather name="x" size={24} />
            </TouchableOpacity>
          )}
        >
          <Text style={{ fontSize: fontSize.h4, fontWeight: "500" }}>
            Add Detail
          </Text>
        </Header>
        <ScrollView style={styles.scrollWrapper}>
          <InputField
            label={"Equipment Name"}
            placeholder={"Input your equipment name"}
            customWrapperStyle={{ marginBottom: 20 }}
            inputType="text"
            onChangeText={value => this.setState({ name: value })}
            value={name}
            returnKeyType={"next"}
          />
          <InputField
            label={"Daily price"}
            placeholder={"Input your equipment Daily price"}
            customWrapperStyle={{ marginBottom: 20 }}
            inputType="text"
            onChangeText={value => this.setState({ dailyPrice: value })}
            value={dailyPrice}
            keyboardType={"numeric"}
            returnKeyType={"next"}
          />
          <InputField
            label={"Delivery price"}
            placeholder={"Input your equipment Delivery price"}
            customWrapperStyle={{ marginBottom: 20 }}
            inputType="text"
            onChangeText={value => this.setState({ deliveryPrice: value })}
            keyboardType={"numeric"}
            value={deliveryPrice}
          />
          <Dropdown
            label={"Select your categories"}
            defaultText={"Select your categories"}
            onSelectValue={value => this.setState({ categories: value })}
            options={DROPDOWN_CATEGORIES_OPTIONS}
          />
          <Dropdown
            label={"Select your types"}
            defaultText={"Select your types"}
            onSelectValue={value => this.setState({ type: value })}
            options={DROPDOWN_TYPES_OPTIONS}
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
              disable
                ? null
                : this.props.navigation.navigate("AddDurationText", {
                    data: this.handlePassValue()
                  })
            }
          >
            <Text style={disable ? styles.textDisable : styles.textEnable}>
              Next
            </Text>
            <Ionicons
              name="ios-arrow-forward"
              size={24}
              color={disable ? "white" : colors.secondaryColor}
            />
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
  scrollWrapper: {
    flex: 1,
    paddingHorizontal: 15
  },
  buttonStyle: {
    backgroundColor: "grey",
    borderRadius: 5,
    height: 100
  },
  titleStyle: {
    fontSize: fontSize.secondaryText
  },
  bottomWrapper: {
    backgroundColor: "transparent",
    zIndex: 1,
    justifyContent: "center",
    alignItems: "flex-end"
  },
  title: {
    fontSize: fontSize.h3,
    color: colors.secondaryColor,
    fontWeight: "bold",
    marginBottom: 20
  },
  textEnable: {
    fontSize: fontSize.bodyText,
    fontWeight: "bold",
    color: colors.secondaryColor,
    paddingRight: 5
  },
  textDisable: {
    fontSize: fontSize.bodyText,
    fontWeight: "bold",
    color: colors.white,
    paddingRight: 5
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

export default AddDetail;
