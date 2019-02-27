import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Switch,
  ScrollView,
  TouchableOpacity,
  Image
} from "react-native";
import { SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import { Feather } from "@expo/vector-icons";
import { ImagePicker, Permissions } from "expo";
import {
  updateEquipment,
  updateEquipmentStatus
} from "../../redux/actions/equipment";

import InputField from "../../components/InputField";
import Dropdown from "../../components/Dropdown";
import Header from "../../components/Header";
import Button from "../../components/Button";
import Loading from "../../components/Loading";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

const DROPDOWN_GENERAL_TYPES_OPTIONS = [
  {
    id: 0,
    name: "Select general equipment types",
    value: "all"
  }
];

const DROPDOWN_TYPES_OPTIONS = [
  {
    id: 0,
    name: "Select equipment types",
    value: "all"
  }
];

const COLORS = {
  AVAILABLE: "#4DB781", //green
  DENIED: "#FF5C5C", //red
  PENDING: "#FFDF49", //yellow
  DELIVERING: "#7199FE", //blue,
  RENTING: "#FFDF49",
  default: "red"
};

@connect(
  (state, ownProps) => {
    const { id } = ownProps.navigation.state.params;
    return {
      equipmentDetail: state.equipment.contractorEquipment.find(
        item => item.id === id
      )
    };
  },
  dispatch => ({
    fetchUpdateEquipment: (equipmentId, equipment) => {
      dispatch(updateEquipment(equipmentId, equipment));
    },
    fetchUpdateEquipmentStatus: (equipmentId, status) => {
      dispatch(updateEquipmentStatus(equipmentId, status));
    }
  })
)
class MyEquipmentDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {}
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    //Check data is update
    if (
      Object.keys(prevState.data).length === 0 &&
      nextProps.equipmentDetail !== prevState.data
    ) {
      return {
        data: nextProps.equipmentDetail
      };
    } else return null;
  }

  _handleChangeBackgroundImage = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === "granted") {
      let result = await ImagePicker.launchImageLibraryAsync();
    }
  };

  _renderAvailableBottom = id => (
    <View style={styles.bottomWrapper}>
      <Button text={"Update"} />
    </View>
  );

  _handleUpdateStatus = async (id, status) => {
    await this.props.fetchUpdateEquipmentStatus(id, { status: status });
    this.props.navigation.goBack();
  };

  _renderDeliveringBottom = id => {
    return (
      <View style={styles.bottomWrapper}>
        <Button
          text={"RENTING"}
          onPress={() => {
            this._handleUpdateStatus(id, "RENTING");
          }}
        />
        <Button
          text={"CANCEL"}
          onPress={() => this.props.navigation.goBack()}
        />
      </View>
    );
  };

  _renderBottomButton = (status, id) => {
    switch (status) {
      case "AVAILABLE":
        return this._renderAvailableBottom(id);
      case "DELIVERING":
        return this._renderDeliveringBottom(id);
      default:
        return null;
    }
  };

  _handleInputChange = (field, value) => {
    let newData = { ...this.setState.data };
    newData[field] = value;
    this.setState({ data: newData });
  };

  _handleInputChangeDate = (field, value) => {
    this.setState({
      data: {
        ...state.data,
        equipment: {
          ...state.data.equipment,
          [field]: value
        }
      }
    });
  };

  _renderScrollItem = () => {
    const { id } = this.props.navigation.state.params;
    const { data } = this.state;
    return (
      <View style={{ paddingHorizontal: 15 }}>
        <View style={styles.landscapeImgWrapper}>
          <Image
            source={{
              uri:
                "https://www.extremesandbox.com/wp-content/uploads/Extreme-Sandbox-Corportate-Events-Excavator-Lifting-Car.jpg"
            }}
            style={styles.landscapeImg}
            resizeMode={"cover"}
          />
          <TouchableOpacity
            style={styles.buttonChangeImage}
            onPress={this._handleChangeBackgroundImage}
          >
            <Feather name="camera" size={24} />
          </TouchableOpacity>
        </View>
        <InputField
          label={"Equipment Name"}
          placeholder={"Input your equipment name"}
          placeholderTextColor={colors.text68}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          onChangeText={value => this._handleInputChange("name", value)}
          value={data.name}
          editable={data.status === "AVAILABLE" ? true : false}
          returnKeyType={"next"}
        />
        <InputField
          label={"Daily price"}
          placeholderTextColor={colors.text68}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          onChangeText={value =>
            this._handleInputChange("dailyPrice", parseInt(value))
          }
          editable={data.status === "AVAILABLE" ? true : false}
          value={data.dailyPrice.toString()}
          keyboardType={"numeric"}
          returnKeyType={"next"}
        />
        <InputField
          label={"Delivery price"}
          placeholderTextColor={colors.text68}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          editable={data.status === "AVAILABLE" ? true : false}
          onChangeText={value =>
            this._handleInputChange("deliveryPrice", parseInt(value))
          }
          keyboardType={"numeric"}
          value={data.deliveryPrice.toString()}
        />
        <Dropdown
          label={"General Type"}
          defaultText={data.equipmentType.generalEquipment.name}
          onSelectValue={value => this.setState({ categories: value })}
          options={DROPDOWN_GENERAL_TYPES_OPTIONS}
        />
        <Dropdown
          label={"Type"}
          defaultText={data.equipmentType.name}
          onSelectValue={value => this.setState({ type: value })}
          options={DROPDOWN_TYPES_OPTIONS}
        />
        <Text style={styles.title}>Available time range</Text>
        <InputField
          label={"From"}
          placeholder={"dd-mm-yyyy"}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          editable={data.status === "AVAILABLE" ? true : false}
          onChangeText={value => this._handleInputChange("beginDate", value)}
          value={data.beginDate}
          returnKeyType={"next"}
        />
        <InputField
          label={"To"}
          placeholder={"dd-mm-yyyy"}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          editable={data.status === "AVAILABLE" ? true : false}
          onChangeText={value => this.setState({ endDate: value })}
          value={data.endDate}
        />
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 15,
              height: 15,
              marginBottom: 10,
              backgroundColor: COLORS[data.status || "default"]
            }}
          />
          <Text style={styles.text}> Status: {data.status}</Text>
        </View>
        {this._renderBottomButton(data.status, id)}
      </View>
    );
  };

  render() {
    const { equipmentDetail } = this.props;
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "never", top: "always" }}
      >
        <Header
          renderLeftButton={() => (
            <TouchableOpacity
              onPress={() => {
                this.props.fetchClearEquipmentDetail();
                this.props.navigation.goBack();
              }}
            >
              <Feather name="x" size={24} />
            </TouchableOpacity>
          )}
        >
          <Text style={styles.header}>Equipment Detail</Text>
        </Header>
        {Object.keys(equipmentDetail).length !== 0 ? (
          <ScrollView>{this._renderScrollItem()}</ScrollView>
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
  bottomWrapper: {
    marginBottom: 10
  },
  landscapeImgWrapper: {
    height: 200,
    marginBottom: 15
  },
  landscapeImg: {
    flex: 1
  },
  buttonChangeImage: {
    position: "absolute",
    bottom: 15,
    right: 15,
    backgroundColor: colors.primaryColor,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center"
  },
  header: {
    fontSize: fontSize.h4,
    fontWeight: "500"
  },
  title: {
    fontSize: fontSize.bodyText,
    fontWeight: "500",
    color: colors.text
  }
});

export default MyEquipmentDetail;
