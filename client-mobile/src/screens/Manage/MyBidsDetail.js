import React, { Component } from "react";
import { SafeAreaView } from "react-navigation";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { connect } from "react-redux";
import {
  getDebrisBidDetail,
  supplierEditBid
} from "../../redux/actions/debris";
import { Feather, Entypo } from "@expo/vector-icons";

import Title from "../../components/Title";
import InputField from "../../components/InputField";
import TextArea from "../../components/TextArea";
import Header from "../../components/Header";
import Button from "../../components/Button";
import Loading from "../../components/Loading";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

@connect(
  (state, ownProps) => {
    const { id } = ownProps.navigation.state.params;
    return {
      bidDetail: state.debris.debrisBids.find(item => item.id === id),
      postDetail: state.debris.debrisDetail
    };
  },
  dispatch => ({
    fetchGetDebrisDetail: postDebrisId => {
      dispatch(getDebrisBidDetail(postDebrisId));
    },
    fetchEditBid: (bidId, newBid) => {
      dispatch(supplierEditBid(bidId, newBid));
    }
  })
)
class MyBidsDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: false,
      data: {}
    };
  }

  componentDidMount() {
    const { postId } = this.props.navigation.state.params;
    this.props.fetchGetDebrisDetail(postId);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    //Check data is update
    if (
      Object.keys(prevState.data).length === 0 &&
      nextProps.bidDetail !== prevState.data
    ) {
      return {
        data: nextProps.bidDetail
      };
    } else return null;
  }

  _capitalizeFirstLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  _formatNumber = num => {
    if (num) {
      return num.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return num;
  };

  _handleEditButton = () => {
    this.setState({ edit: !this.state.edit });
  };

  _handleSubmitEditButton = async () => {
    const { data } = this.state;
    const newBid = {
      price: parseFloat(data.price),
      description: data.description,
      debrisPost: {
        id: data.debrisPost.id
      }
    };
    await this.props.fetchEditBid(data.id, newBid);
    this.setState({ edit: !this.state.edit });
  };

  _handleInputChanged = (field, value) => {
    this.setState({
      data: {
        ...this.state.data,
        [field]: value
      }
    });
  };

  _renderEditContent = () => {
    const { data } = this.state;
    // console.log(data);
    return (
      <View>
        <Text style={[styles.title, { marginBottom: 5 }]}>
          {data.debrisPost.title}
        </Text>
        <Text style={styles.status}>{data.status}</Text>
        <InputField
          label={"Your current bid (VND)"}
          placeholder={"Your current bid (VND)"}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          onChangeText={value => this._handleInputChanged("price", value)}
          value={this._formatNumber(data.price.toString())}
          keyboardType={"numeric"}
          returnKeyType={"next"}
        />
        <Title title={"Description"} />
        <TextArea
          value={data.description}
          onChangeText={value => this._handleInputChanged("description", value)}
        />
        <Button
          text={"Submit"}
          onPress={() => this._handleSubmitEditButton()}
        />
      </View>
    );
  };

  _renderContent = () => {
    const { postDetail, bidDetail } = this.props;
    return (
      <View>
        <Text style={[styles.title, { marginBottom: 5 }]}>
          {bidDetail.debrisPost.title}
        </Text>
        <Text style={styles.status}>{bidDetail.status}</Text>
        <Title title={"Your current bid (VND)"} />
        <Text style={styles.text}>{bidDetail.price}K VND</Text>
        {/* <Title title={"Services Required"} />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            flexWrap: "wrap"
          }}
        >
          {postDetail.debrisServiceTypes.map((item, index) => (
            <Text style={styles.text}>
              {index == 0 ? null : <Entypo name="dot-single" size={15} />}
              {this._capitalizeFirstLetter(item.name)}
            </Text>
          ))}
        </View> */}
        {bidDetail.description ? (
          <View>
            <Title title={"Description"} />
            <Text style={styles.description}>
              {this._capitalizeFirstLetter(bidDetail.description)}
            </Text>
          </View>
        ) : null}
      </View>
    );
  };

  render() {
    const { postDetail, loading, navigation } = this.props;
    const { edit } = this.state;
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "always", top: "always" }}
      >
        <Header
          renderLeftButton={() => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather name="arrow-left" size={24} />
            </TouchableOpacity>
          )}
          renderRightButton={() => (
            <TouchableOpacity onPress={() => this._handleEditButton()}>
              <Text>Edit</Text>
            </TouchableOpacity>
          )}
        >
          <Text style={styles.title}>Bid Detail</Text>
        </Header>
        {!loading ? (
          <ScrollView contentContainerStyle={{ paddingHorizontal: 15 }}>
            {edit ? this._renderEditContent() : this._renderContent()}
          </ScrollView>
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
  title: {
    fontSize: fontSize.bodyText,
    fontWeight: "500",
    color: colors.text
  },
  status: {
    fontSize: fontSize.secondaryText,
    fontWeight: "500",
    color: colors.lightGreen
  },
  text: {
    fontSize: fontSize.secondaryText,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 5
  },
  description: {
    fontSize: fontSize.caption,
    fontWeight: "600",
    color: colors.text68,
    marginBottom: 5
  }
});

export default MyBidsDetail;
