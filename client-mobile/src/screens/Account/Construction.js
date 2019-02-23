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

import InputField from "../../components/InputField";
import Header from "../../components/Header";
import Loading from "../../components/Loading";
import Button from "../../components/Button";
import ConstructionItem from "./components/ConstructionItem";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

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
      action: null
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
    try {
      this.props.fetchCreateConstruction(contractorId, construction);
    } catch (error) {
      this._showAlert(error);
    }
    this.setState({ address: "", name: "" });
    this._setModalVisible(!modalVisible);
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
    const { address, name } = this.state;
    return (
      <View style={{ paddingHorizontal: 15 }}>
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
        <InputField
          label={"Address"}
          placeholder={"Input your address"}
          placeholderTextColor={colors.text68}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          onChangeText={value => this._handleInputChange("address", value)}
          value={address}
          returnKeyType={"next"}
        />
        <Button text={"Submit"} onPress={() => this._handleSubmitButton()} />
      </View>
    );
  };

  _renderScrollViewItem = () => {
    const { list } = this.props;
    const { contractorId } = this.props.navigation.state.params;
    return (
      <View style={{ paddingHorizontal: 15 }}>
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
        <Header
          renderRightButton={() => (
            <TouchableOpacity onPress={() => this._setModalVisible(true)}>
              <Feather name="plus" size={22} />
            </TouchableOpacity>
          )}
        >
          <Text style={styles.header}>My Construction</Text>
        </Header>
        {list ? (
          <View style={{ flex: 1 }}>
            {this._displayModalView()}
            <ScrollView>{this._renderScrollViewItem()}</ScrollView>
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
