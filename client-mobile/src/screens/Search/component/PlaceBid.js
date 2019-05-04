import React, { Component } from "react";
import PropTypes from "prop-types";
import { SafeAreaView } from "react-navigation";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  TextInput
} from "react-native";
import { connect } from "react-redux";
import {
  supplierPlaceBid,
  supplierEditBid
} from "../../../redux/actions/debris";
import Feather from "@expo/vector-icons/Feather";

import Button from "../../../components/Button";
import Header from "../../../components/Header";
import TextArea from "../../../components/TextArea";

import colors from "../../../config/colors";
import fontSize from "../../../config/fontSize";

@connect(
  state => ({}),
  dispatch => ({
    fetchPlaceBid: bid => {
      dispatch(supplierPlaceBid(bid));
    },
    fetchEditBid: (bidId, bid) => {
      dispatch(supplierEditBid(bidId, bid));
    }
  })
)
class PlaceBid extends Component {
  static propTypes = {
    visible: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {
      price: props.price ? props.price : 0,
      description: props.description ? props.description : ""
    };
  }

  _handlePlaceBid = () => {
    const { price, description } = this.state;
    const { postId } = this.props;
    const bid = {
      price: parseInt(price),
      description,
      debrisPost: {
        id: postId
      }
    };
    this.props.fetchPlaceBid(bid);
    this.props.setModalVisible(false);
  };

  _handleEditBid = () => {
    const { price, description } = this.state;
    const { postId, bidId } = this.props;
    const bid = {
      price: parseInt(price),
      description,
      debrisPost: {
        id: postId
      }
    };
    this.props.fetchEditBid(bidId, bid);
    this.props.setModalVisible(false);
  };

  render() {
    const { visible, onPress, isEdited, title, setModalVisible } = this.props;
    const { price, description } = this.state;
    return (
      <Modal animationType={"slide"} visible={visible}>
        <SafeAreaView forceInset={{ top: "always" }} style={styles.container}>
          <Header
            renderLeftButton={() => (
              <TouchableOpacity
                onPress={() => this.props.setModalVisible(false)}
              >
                <Feather name={"x"} size={26} />
              </TouchableOpacity>
            )}
          >
            <Text style={styles.title}>Place your bid</Text>
          </Header>
          <ScrollView style={{ paddingHorizontal: 15 }}>
            <Text style={styles.text}>Place a bid on:</Text>
            <Text style={styles.text}>{title}</Text>
            <Text style={styles.text}>Paid to you</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center"
              }}
            >
              <TextInput
                style={styles.inputWrapper}
                onChangeText={value => this.setState({ price: value })}
                value={price.toString()}
                keyboardType={"numeric"}
              />
              <View
                style={{
                  height: 30,
                  width: 40,
                  borderTopRightRadius: 5,
                  borderBottomRightRadius: 5,
                  backgroundColor: colors.grayWhite,
                  alignItems: "center",
                  justifyContent: "center",
                  borderColor: "#000000",
                  borderWidth: StyleSheet.hairlineWidth
                }}
              >
                <Text style={[styles.text, { color: colors.primaryColor }]}>
                  {" "}
                  K{" "}
                </Text>
              </View>
            </View>
            <Text style={[styles.text, { marginTop: 10 }]}>
              Describe your bid
            </Text>
            <TextArea
              numberOfLines={5}
              maxLength={1000}
              onChangeText={value => this.setState({ description: value })}
              value={description}
            />
          </ScrollView>
          <SafeAreaView forceInset={{ bottom: "always" }}>
            {isEdited ? (
              <Button
                bordered={false}
                text={"Edit bid"}
                onPress={this._handleEditBid}
                buttonStyle={{ backgroundColor: colors.secondaryColor }}
              />
            ) : (
              <Button
                bordered={false}
                text={"Place bid"}
                onPress={this._handlePlaceBid}
                buttonStyle={{ backgroundColor: colors.secondaryColor }}
              />
            )}
          </SafeAreaView>
        </SafeAreaView>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  inputWrapper: {
    paddingLeft: 10,
    borderColor: "#000000",
    borderWidth: StyleSheet.hairlineWidth,
    fontSize: fontSize.bodyText,
    color: colors.text,
    fontWeight: "400",
    width: 200,
    height: 30,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5
  },
  wrapper: {
    paddingLeft: 10,
    height: 200,
    borderColor: "#000000",
    borderWidth: StyleSheet.hairlineWidth,
    fontSize: fontSize.bodyText,
    color: colors.text,
    fontWeight: "400",
    borderRadius: 5,
    marginTop: 10
  },
  title: {
    fontSize: fontSize.bodyText,
    fontWeight: "600",
    color: colors.text
  },
  text: {
    fontSize: fontSize.secondaryText,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 5
  }
});

export default PlaceBid;
