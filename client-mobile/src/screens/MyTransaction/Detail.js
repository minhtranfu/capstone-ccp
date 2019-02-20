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
  getTransactionDetail,
  approveTransaction,
  denyTransaction,
  clearTransactionDetail
} from "../../redux/actions/transaction";

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
    return {
      equipmentDetail: state.equipment.detail,
      transactionDetail: state.transaction.transactionDetail,
      //test
      equipment: state.equipment.list
    };
  },
  dispatch => ({
    fetchTransactionDetail: id => {
      dispatch(getTransactionDetail(id));
    },
    fetchClearDetail: () => {
      dispatch(clearTransactionDetail());
    },
    fetchApproveTransaction: (id, transactionStatus) => {
      dispatch(approveTransaction(id, transactionStatus));
    },
    fetchDenyTransaction: (id, transactionStatus) => {
      dispatch(denyTransaction(id, transactionStatus));
    }
  })
)
class MyTransactionDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      dailyPrice: "",
      type: null,
      categories: null,
      deliveryPrice: "",
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
    console.log("render");
    //Check data is update
    if (
      Object.keys(prevState.data).length === 0 &&
      nextProps.transactionDetail !== prevState.data
    ) {
      return {
        data: nextProps.transactionDetail
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
      <Button text={"Delete"} />
    </View>
  );

  _handleReRender = async (id, status) => {
    await this.props.fetchApproveTransaction(id, { status: status });
    this.props.navigation.goBack();
  };

  _renderPendingBottom = id => {
    return (
      <View style={styles.bottomWrapper}>
        <Button
          text={"Accept"}
          onPress={() => {
            this._handleReRender(id, "ACCEPTED");
          }}
        />
        <Button
          text={"Denied"}
          onPress={() => {
            this._handleReRender(id, "DENIED");
          }}
        />
      </View>
    );
  };

  _renderAcceptedBottom = id => (
    <View style={styles.bottomWrapper}>
      <Button text={"Delivery"} />
    </View>
  );

  _renderBottomButton = (status, id) => {
    switch (status) {
      case "ACCEPTED":
        return this._renderAcceptedBottom(id);
      case "PENDING":
        return this._renderPendingBottom(id);
      case "AVAILABLE":
        return this._renderAvailableBottom(id);
      default:
        return null;
    }
  };

  _handleInputChange = (field, value) => {
    // console.log(value, field);
    // this.setState({ field: value });
    // this.setState(prevState => ({
    //   data: {
    //     ...prevState.data,
    //     field: parseInt(value)
    //   }
    // }));
    let newData = { ...this.setState.data };
    newData.dailyPrice = value;
    this.setState({ data: newData });
    console.log(this.state.data);
    // this.setState({data:{
    //   ...data,
    //   equipment:{
    //     ...data.equipment,
    //     field: value
    //   }
    // }})
  };

  _handleInputField = (field, value) => {
    this.setState({ field: value });
  };

  _renderScrollItem = () => {
    const { id } = this.props.navigation.state.params;
    const { transactionDetail } = this.props;
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
          onChangeText={value => this.setState({ name: value })}
          value={transactionDetail.equipment.name}
          returnKeyType={"next"}
        />
        <InputField
          label={"Daily price"}
          placeholderTextColor={colors.text68}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          onChangeText={value => this._handleInputChange("dailyPrice", value)}
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
          value={transactionDetail.deliveryPrice.toString()}
        />
        <Dropdown
          label={"General Type"}
          defaultText={
            transactionDetail.equipment.equipmentType.generalEquipment.name
          }
          onSelectValue={value => this.setState({ categories: value })}
          options={DROPDOWN_GENERAL_TYPES_OPTIONS}
        />
        <Dropdown
          label={"Type"}
          defaultText={transactionDetail.equipment.equipmentType.name}
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
          value={transactionDetail.beginDate}
          returnKeyType={"next"}
        />
        <InputField
          label={"To"}
          placeholder={"dd-mm-yyyy"}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          onChangeText={value => this.setState({ endDate: value })}
          value={transactionDetail.endDate}
        />
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 15,
              height: 15,
              backgroundColor: COLORS[transactionDetail.status || "default"]
            }}
          />
          <Text style={styles.text}> Status: {transactionDetail.status}</Text>
        </View>
        {this._renderBottomButton(transactionDetail.status, id)}
      </View>
    );
  };

  render() {
    const { transactionDetail } = this.props;
    console.log(transactionDetail);
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "never", top: "always" }}
      >
        <Header
          renderLeftButton={() => (
            <TouchableOpacity
              onPress={() => {
                this.props.fetchClearDetail();
                this.props.navigation.goBack();
              }}
              renderRightButton={() => (
                <TouchableOpacity
                  onPress={() => {
                    this.props.fetchClearDetail();
                    this.props.navigation.goBack();
                  }}
                >
                  <Text>Save and exit</Text>
                </TouchableOpacity>
              )}
            >
              <Feather name="x" size={24} />
            </TouchableOpacity>
          )}
        >
          <Text style={styles.header}>My Transaction</Text>
        </Header>
        {Object.keys(transactionDetail).length !== 0 ? (
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

export default MyTransactionDetail;
