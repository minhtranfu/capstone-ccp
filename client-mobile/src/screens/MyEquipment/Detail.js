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
  getEquipmentDetail,
  getTransactionDetail
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
  ACCEPTED: "#4DB781", //green
  DENIED: "#FF5C5C", //red
  PENDING: "#FFDF49",
  default: "red"
  // blue: 7199FE, yellow: FFDF49
};

@connect(
  state => {
    console.log(state.equipment);
    return {
      equipmentDetail: state.equipment.detail,
      transactionDetail: state.equipment.transactionDetail,
      //test
      equipment: state.equipment.list
    };
  },
  dispatch => ({
    fetchEquipmentDetail: id => {
      dispatch(getEquipmentDetail(id));
    },
    fetchTransactionDetail: id => {
      dispatch(getTransactionDetail(id));
    }
  })
)
class MyEquipmentDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: null,
      dailyPrice: null,
      type: null,
      categories: null,
      deliveryPrice: null,
      beginDate: "",
      endDate: "",
      thumbnailImage: "",
      descriptionImages: [],
      data: {}
    };
  }

  componentDidMount() {
    const { id } = this.props.navigation.state.params;
    this.props.fetchTransactionDetail(id);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    //Check data is update
    if (nextProps.transactionDetail.data !== prevState.data) {
      return { data: nextProps.transactionDetail.data };
    } else return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.transactionDetail.data !== this.props.transactionDetail.data
    ) {
      //Update new state
      this.setState({ data: this.props.transactionDetail.data });
    }
  }

  _handleChangeBackgroundImage = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === "granted") {
      let result = await ImagePicker.launchImageLibraryAsync();
    }
  };

  _renderAvailableBottom = () => (
    <View style={styles.bottomWrapper}>
      <Button text={"Update"} />
      <Button text={"Delete"} />
    </View>
  );

  _renderPendingBottom = () => (
    <View style={styles.bottomWrapper}>
      <Button text={"Accept"} />
      <Button text={"Denied"} />
    </View>
  );

  _renderAcceptedBottom = () => (
    <View style={styles.bottomWrapper}>
      <Button text={"Delivery"} />
    </View>
  );

  _renderBottomButton = status => {
    switch (status) {
      case "ACCEPTED":
        return this._renderAcceptedBottom();
      case "PENDING":
        return this._renderPendingBottom();
      case "AVAILABLE":
        return this._renderAvailableBottom();
      default:
        return null;
    }
  };

  _renderScrollItem = () => {
    const { id } = this.props.navigation.state.params;
    const { data } = this.props.transactionDetail;
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
          onChangeText={value => this.setState({ name: value })}
          value={data.equipment.name}
          returnKeyType={"next"}
        />
        <InputField
          label={"Daily price"}
          placeholderTextColor={colors.text68}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          onChangeText={value => this.setState({ dailyPrice: value })}
          value={data.dailyPrice.toString()}
          keyboardType={"numeric"}
          returnKeyType={"next"}
        />
        <InputField
          label={"Delivery price"}
          placeholderTextColor={colors.text68}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          onChangeText={value => this.setState({ deliveryPrice: value })}
          keyboardType={"numeric"}
          value={data.deliveryPrice.toString()}
        />
        <Dropdown
          label={"General Type"}
          defaultText={data.equipment.equipmentType.generalEquipment.name}
          onSelectValue={value => this.setState({ categories: value })}
          options={DROPDOWN_GENERAL_TYPES_OPTIONS}
        />
        <Dropdown
          label={"Type"}
          defaultText={data.equipment.equipmentType.name}
          onSelectValue={value => this.setState({ type: value })}
          options={DROPDOWN_TYPES_OPTIONS}
        />
        <Text style={styles.title}>Available time range</Text>
        <InputField
          label={"From"}
          placeholder={"dd-mm-yyyy"}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          onChangeText={value => this.setState({ beginDate: value })}
          value={data.beginDate}
          returnKeyType={"next"}
        />
        <InputField
          label={"To"}
          placeholder={"dd-mm-yyyy"}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          onChangeText={value => this.setState({ endDate: value })}
          value={data.endDate}
        />
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 15,
              height: 15,
              backgroundColor: COLORS[data.status || "default"]
            }}
          />
          <Text style={styles.text}> Status: {data.status}</Text>
        </View>
        {this._renderBottomButton(data.status)}
      </View>
    );
  };

  render() {
    const { transactionDetail } = this.props;
    const { id } = this.props.navigation.state.params;

    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "never", top: "always" }}
      >
        <Header
          renderLeftButton={() => (
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Feather name="x" size={24} />
            </TouchableOpacity>
          )}
        >
          <Text style={styles.header}>My Equipment</Text>
        </Header>
        {transactionDetail.data ? (
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
