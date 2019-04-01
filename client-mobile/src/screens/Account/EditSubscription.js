import React, { Component } from "react";
import { SafeAreaView } from "react-navigation";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getGeneralEquipmentType } from "../../redux/actions/type";
import { editSubscription } from "../../redux/actions/subscription";
import { autoCompleteSearch } from "../../redux/actions/location";
import Feather from "@expo/vector-icons/Feather";

import { DROPDOWN_OPTIONS } from "../../Utils/Constants";
import TimeRange from "../../components/TimeRange";
import InputField from "../../components/InputField";
import Loading from "../../components/Loading";
import Header from "../../components/Header";
import Button from "../../components/Button";
import AutoComplete from "../../components/AutoComplete";
import Dropdown from "../../components/Dropdown";
import WithRangeCalendar from "../../components/WithRangeCalendar";

import fontSize from "../../config/fontSize";
import colors from "../../config/colors";

@connect(
  (state, ownProps) => {
    const { id } = ownProps.navigation.state.params;
    return {
      loading: state.type.loading,
      categories: state.type.listGeneralEquipmentType,
      construction: state.contractor.constructionList,
      subscriptionDetail: state.subscription.listSubscription.find(
        item => item.id === id
      )
    };
  },
  dispatch =>
    bindActionCreators(
      {
        fetchGetCategories: getGeneralEquipmentType,
        fetchEditSubscription: editSubscription
      },
      dispatch
    )
)
class EditSubscription extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subscription: {},
      isModalOpen: false,
      generalType: null,
      generalTypeIndex: 0,
      type: null,
      typeIndex: 0,
      location: [],
      hideResults: false
    };
  }

  componentDidMount() {
    this.props.fetchGetCategories();
  }

  static getDerivedStateFromProps(props, state) {
    if (
      Object.keys(state.subscription).length === 0 &&
      props.subscriptionDetail
    ) {
      return {
        subscription: props.subscriptionDetail,
        generalType:
          props.subscriptionDetail.equipmentType.generalEquipment.name,
        type: props.subscriptionDetail.equipmentType.name
      };
    }
  }

  _capitalizeLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  _formatNumber = num => {
    if (num) {
      return num.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return num;
  };

  _validateData = () => {
    const { subscription } = this.state;
    if (subscription) {
      return true;
    }
    return false;
  };

  _handleAddressChange = async address => {
    this.setState({
      location: await autoCompleteSearch(address, null, null)
    });
  };

  _setModalVisible = visible => {
    this.setState({ isModalOpen: visible });
  };

  _handleInputChanged = (field, value) => {
    this.setState({
      subscription: {
        ...this.state.subscription,
        [field]: value
      }
    });
  };

  //Create new dropdown options for general type
  _handleCategoryOptions = () => {
    const { categories } = this.props;
    let newCategoryOptions = categories.map(item => ({
      id: item.id,
      name: this._capitalizeLetter(item.name),
      value: this._capitalizeLetter(item.name)
    }));
    return [...DROPDOWN_OPTIONS.CATEGORY, ...newCategoryOptions];
  };

  _findEquipmentTypeByCategoryId = () => {
    const { generalTypeIndex } = this.state;
    const { categories } = this.props;
    const categoryOptions = this._handleCategoryOptions();
    return categories.find(
      item => item.id === categoryOptions[generalTypeIndex].id
    );
  };

  _handleEquipmentTypeOptions = () => {
    let result = this._findEquipmentTypeByCategoryId();
    if (result) {
      let newEquipmentTypeOptions = result.equipmentTypes.map(item => ({
        id: item.id,
        name: this._capitalizeLetter(item.name),
        value: this._capitalizeLetter(item.name)
      }));
      return [...DROPDOWN_OPTIONS.TYPE, ...newEquipmentTypeOptions];
    }
    return DROPDOWN_OPTIONS.TYPE;
  };

  _handleOnChangeDate = (modalVisible, timeRange) => {
    this.setState({
      isModalOpen: modalVisible,
      subscription: {
        ...this.state.subscription,
        beginDate: timeRange.beginDate,
        endDate: timeRange.endDate
      }
    });
  };

  _renderAutoCompleteItem = item => (
    <TouchableOpacity
      style={styles.autocompleteWrapper}
      onPress={() => {
        this.setState({
          subscription: {
            ...this.state.subscription,
            address: item.main_text + ", " + item.secondary_text,
            latitude: item.lat,
            longitude: item.lng
          },
          hideResults: true
        });
      }}
    >
      <Text style={styles.addressMainText}>{item.main_text}</Text>
      <Text style={styles.caption}>{item.secondary_text}</Text>
    </TouchableOpacity>
  );

  _renderDateTimeModal = () => {
    const { isModalOpen } = this.state;
    return (
      <Modal visible={isModalOpen}>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <WithRangeCalendar
            onConfirm={timeRange => {
              this._handleOnChangeDate(false, timeRange);
              this.setState(() => ({ isModalOpen: false }));
            }}
            onClose={() => this.setState(() => ({ isModalOpen: false }))}
            single={true}
          />
        </View>
      </Modal>
    );
  };

  _handleSubmit = async () => {
    const { subscription, typeIndex } = this.state;
    const { id } = this.props.navigation.state.params;
    const result = this._findEquipmentTypeByCategoryId();
    const newSubscription = {
      ...subscription,
      maxPrice: parseInt(subscription.maxPrice),
      maxDistance: parseInt(subscription.maxDistance),
      equipmentType: {
        id: result
          ? result.equipmentTypes[typeIndex - 1].id
          : subscription.equipmentType.id
      }
    };
    await this.props.fetchEditSubscription(id, newSubscription);
    this.props.navigation.goBack();
  };

  _renderContent = () => {
    const { subscription, location, generalType, type } = this.state;
    const { construction, subscriptionDetail } = this.props;
    return (
      <View>
        <InputField
          label={"Price"}
          placeholder={"Input your max price"}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          onChangeText={value => this._handleInputChanged("maxPrice", value)}
          value={this._formatNumber(subscription.maxPrice.toString())}
          keyboardType={"numeric"}
          returnKeyType={"next"}
        />
        <InputField
          label={"Distance"}
          placeholder={"Input your max distance"}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          onChangeText={value => this._handleInputChanged("maxDistance", value)}
          value={subscription.maxDistance.toString()}
          returnKeyType={"next"}
        />
        <AutoComplete
          label={"Address"}
          placeholder={"Input your address"}
          onFocus={() => this.setState({ hideResults: false })}
          hideResults={this.state.hideResults}
          editable={
            !construction || construction === "Select your construction"
          }
          data={location}
          value={subscription.address}
          onChangeText={value => {
            this._handleInputChanged("address", value);
            this._handleAddressChange(value);
          }}
          renderItem={item => this._renderAutoCompleteItem(item)}
        />
        <Dropdown
          label={"Equipment category: "}
          defaultText={generalType}
          onSelectValue={(value, index) =>
            this.setState({ generalTypeIndex: index, generalType: value })
          }
          options={this._handleCategoryOptions()}
          style={{ marginBottom: 20 }}
        />
        <Dropdown
          label={"Equipment type: "}
          defaultText={type}
          onSelectValue={(value, index) =>
            this.setState({ type: value, typeIndex: index })
          }
          options={this._handleEquipmentTypeOptions()}
          style={{ marginBottom: 20 }}
        />
        <TimeRange
          beginDate={subscription.beginDate}
          endDate={subscription.endDate}
          onPress={() => this._setModalVisible(true)}
        />
        {this._renderDateTimeModal()}
      </View>
    );
  };

  render() {
    const { subcription } = this.state;
    return (
      <SafeAreaView style={styles.container} forceInset={{ top: "always" }}>
        <Header
          renderLeftButton={() => (
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Feather name="chevron-left" size={24} />
            </TouchableOpacity>
          )}
        >
          <Text style={{ fontSize: fontSize.bodyText, fontWeight: "500" }}>
            Edit subscription
          </Text>
        </Header>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 15 }}>
          {this._renderContent()}
        </ScrollView>
        <SafeAreaView
          forceInset={{ bottom: "always" }}
          style={{
            backgroundColor: this._validateData()
              ? colors.secondaryColor
              : "#a5acb8"
          }}
        >
          <Button
            text={"Save"}
            onPress={this._handleSubmit}
            disabled={!this._validateData()}
            buttonStyle={{ backgroundColor: "transparent" }}
          />
        </SafeAreaView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default EditSubscription;
