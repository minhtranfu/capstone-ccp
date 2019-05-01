import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Animated,
  Alert
} from "react-native";
import { SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import { Feather } from "@expo/vector-icons";
import {
  getConstructionList,
  createConstruction,
  deleteConstruction
} from "../../redux/actions/contractor";
import { autoCompleteSearch } from "../../redux/actions/location";

import AutoComplete from "../../components/AutoComplete";
import InputField from "../../components/InputField";
import Header from "../../components/Header";
import Loading from "../../components/Loading";
import Button from "../../components/Button";
import ConstructionItem from "./components/ConstructionItem";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";
import ParallaxList from "../../components/ParallaxList";

@connect(
  state => ({
    list: state.contractor.constructionList,
    message: state.status.message
  }),
  dispatch => ({
    fetchGetConstructionList: contractorId => {
      dispatch(getConstructionList(contractorId));
    },
    fetchCreateConstruction: (contractorId, construction) => {
      dispatch(createConstruction(contractorId, construction));
    },
    fetchDeleteConstruction: (contractorId, constructionId) => {
      dispatch(deleteConstruction(contractorId, constructionId));
    }
  })
)
class Construction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      modalConfirmVisible: false,
      address: "",
      name: "",
      action: null,
      location: null,
      hideResults: false
    };
  }

  componentDidMount() {
    const { contractorId } = this.props.navigation.state.params;
    this.props.fetchGetConstructionList(contractorId);
  }

  componentDidUpdate(prevProps, prevState) {
    const { contractorId } = this.props.navigation.state.params;
    if (prevProps.list && prevProps.list.length !== this.props.list.length) {
      this.props.fetchGetConstructionList(contractorId);
    }
  }

  _setModalVisible = visible => {
    this.setState({ modalVisible: visible });
  };

  _showAlert = msg => {
    Alert.alert("Error", msg, [{ text: "OK" }], {
      cancelable: true
    });
  };

  _handleRemoveConstruction = (contractorId, constructionId) => {
    Alert.alert("Are you sure to delete?", undefined, [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel"
      },
      {
        text: "OK",
        onPress: () =>
          this.props.fetchDeleteConstruction(contractorId, constructionId)
      }
    ]);
  };

  _handleInputChange = (property, value) => {
    this.setState({ [property]: value });
  };

  _handleSubmitButton = () => {
    const { contractorId } = this.props.navigation.state.params;
    const { address, name, modalVisible } = this.state;
    const construction = {
      name: name,
      address: address,
      longitude: 10.312,
      latitude: 10.312
    };
    this.props.fetchCreateConstruction(contractorId, construction);
    this.setState({ address: "", name: "" });
    this._setModalVisible(!modalVisible);
  };

  _renderAutoCompleteItem = item => (
    <TouchableOpacity
      style={styles.autocompleteWrapper}
      onPress={() => {
        this.setState({
          address: item.main_text + ", " + item.secondary_text,
          lat: item.lat,
          lng: item.lng,
          hideResults: true
        });
      }}
    >
      <Text style={styles.addressMainText}>{item.main_text}</Text>
      <Text style={styles.caption}>{item.secondary_text}</Text>
    </TouchableOpacity>
  );

  _handleAddressChange = async address => {
    this.setState({
      location: await autoCompleteSearch(address, null, null)
    });
  };

  //Display modal view
  _displayModalView = () => (
    <Modal
      animationType="slide"
      transparent={false}
      visible={this.state.modalVisible}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
      }}
    >
      <SafeAreaView
        style={{ flex: 1 }}
        forceInset={{ bottom: "always", top: "always" }}
      >
        <Header
          renderLeftButton={() => (
            <TouchableOpacity onPress={() => this._setModalVisible(false)}>
              <Feather name="x" size={24} />
            </TouchableOpacity>
          )}
        >
          <Text style={styles.header}>Add your construction</Text>
        </Header>
        <ScrollView>{this._renderModalItem()}</ScrollView>
      </SafeAreaView>
    </Modal>
  );

  _renderModalItem = () => {
    const { address, name, location } = this.state;
    return (
      <View style={{ paddingHorizontal: 15, paddingTop: 15 }}>
        <InputField
          label={"Name"}
          placeholder={"Input your construction name"}
          placeholderTextColor={colors.text68}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          onChangeText={value => this._handleInputChange("name", value)}
          value={name}
          returnKeyType={"next"}
        />
        <AutoComplete
          label={"Address"}
          placeholder={"Input your address"}
          onFocus={() => this.setState({ hideResults: false })}
          hideResults={this.state.hideResults}
          data={location}
          value={address}
          onChangeText={value => {
            this.setState({ address: value });
            this._handleAddressChange(value);
          }}
          renderItem={item => this._renderAutoCompleteItem(item)}
        />
        <Button text={"Submit"} onPress={this._handleSubmitButton} />
      </View>
    );
  };

  _renderScrollViewItem = () => {
    const { list } = this.props;
    const { contractorId } = this.props.navigation.state.params;
    console.log(list);
    return (
      <View style={{ paddingHorizontal: 15, paddingTop: 15 }}>
        {list.length > 0 ? (
          <View>
            {list
              .filter(item => item.deleted !== true)
              .map(item => (
                <ConstructionItem
                  key={item.id}
                  name={item.name}
                  address={item.address}
                  onPress={() =>
                    this.props.navigation.navigate("ConstructionDetail", {
                      contractorId: contractorId,
                      constructionId: item.id,
                      name: item.name,
                      address: item.address
                    })
                  }
                  onIconPress={() =>
                    this._handleRemoveConstruction(contractorId, item.id)
                  }
                />
              ))}
          </View>
        ) : (
          <TouchableOpacity onPress={() => this._setModalVisible(true)}>
            <View style={styles.actionWrapper}>
              <Text style={styles.text}>+ Add Your Construction</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  render() {
    const { list } = this.props;
    const { action } = this.state;
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "never", top: "always" }}
      >
        {list ? (
          <View style={{ flex: 1, flexDirection: "column" }}>
            {this._displayModalView()}
            <ParallaxList
              title={"My Constructions"}
              hasLeft={true}
              hasCart={false}
              hasAdd
              onAddPress={() => this._setModalVisible(true)}
              scrollElement={<Animated.ScrollView />}
              renderScrollItem={this._renderScrollViewItem}
            />
          </View>
        ) : (
          <View>{message ? this._showAlert(message) : <Loading />}</View>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  actionWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "35%",
    borderRadius: 9,
    borderStyle: "dashed",
    borderWidth: 3,
    borderColor: "#DEE4E3"
  },
  header: {
    fontSize: fontSize.h4,
    fontWeight: "500",
    color: colors.text
  },
  text: {
    fontSize: fontSize.bodyText,
    fontWeight: "500"
  }
});

export default Construction;
