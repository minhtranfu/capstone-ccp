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
      startDate: "",
      endDate: "",
      thumbnailImage: "",
      descriptionImages: []
    };
  }

  componentDidMount() {
    const { id } = this.props.navigation.state.params;
    this.props.fetchTransactionDetail(id);
  }

  getDerivedStateFromProps(props, state) {
    const { transactionDetail } = this.props;
    this.setState({
      name: transactionDetail.equipment.name,
      dailyPrice: transactionDetail.dailyPrice,
      type: transactionDetail.equipmentType.name,
      generalEquipment: transactionDetail.equipmentType.generalEquipment.name,
      deliveryPrice: transactionDetail.deliveryPrice
    });
  }

  _handleChangeBackgroundImage = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    if (status === "granted") {
      let result = await ImagePicker.launchImageLibraryAsync();
    }
  };

  renderScrollItem = () => {
    const { id } = this.props.navigation.state.params;
    const { transactionDetail } = this.props;
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
          value={transactionDetail.equipment.name}
          returnKeyType={"next"}
        />
        <InputField
          label={"Daily price"}
          placeholder={"Input your equipment Daily price"}
          placeholderTextColor={colors.text68}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          onChangeText={value => this.setState({ dailyPrice: value })}
          value={transactionDetail.dailyPrice}
          keyboardType={"numeric"}
          returnKeyType={"next"}
        />
        <InputField
          label={"Delivery price"}
          placeholder={"Input your equipment Delivery price"}
          placeholderTextColor={colors.text68}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          onChangeText={value => this.setState({ deliveryPrice: value })}
          keyboardType={"numeric"}
          value={transactionDetail.deliveryPrice}
        />
        <Dropdown
          label={"Select your categories"}
          defaultText={transactionDetail.equipmentType.generalEquipment.name}
          onSelectValue={value => this.setState({ categories: value })}
          options={DROPDOWN_CATEGORIES_OPTIONS}
        />
        <Dropdown
          label={"Select your types"}
          defaultText={transactionDetail.equipmentType.name}
          onSelectValue={value => this.setState({ type: value })}
          options={DROPDOWN_TYPES_OPTIONS}
        />

        {data.status === "pending" || data.status === "delivery" ? (
          <View style={styles.bottomWrapper}>
            <Text>Do you want to manage your delivery?</Text>
            <Switch />
            <Button text={"Accept"} />
            <Button text={"Decline"} />
          </View>
        ) : (
          <View style={styles.bottomWrapper}>
            <Button text={"Update"} />
            <Button text={"Delete"} />
          </View>
        )}
      </View>
    );
  };

  render() {
    const { transactionDetail } = this.props;
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
          <Text>My Equipment</Text>
        </Header>
        {transactionDetail ? (
          <ScrollView>{this.renderScrollItem()}</ScrollView>
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
    flexDirection: "column",
    justifyContent: "center"
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
  }
});

export default MyEquipmentDetail;
