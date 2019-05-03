import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Alert,
  RefreshControl
} from "react-native";
import { connect } from "react-redux";
import Feather from "@expo/vector-icons/Feather";
import { bindActionCreators } from "redux";
import { Image } from "react-native-expo-image-cache";
import {
  getContractorEquipmentList,
  removeEquipment
} from "../../redux/actions/equipment";
import { withNavigation } from "react-navigation";

import TabView from "../../components/TabView";
import AddModal from "./components/AddModal";
import ParallaxList from "../../components/ParallaxList";
import Dropdown from "../../components/Dropdown";
import Button from "../../components/Button";
import EquipmentItem from "../../components/EquipmentItem";
import EquipmentStatus from "../../components/EquipmentStatus";
import Header from "../../components/Header";
import Loading from "../../components/Loading";
import { DROPDOWN_OPTIONS } from "../../Utils/Constants";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

const ITEM_HEIGHT = 224;
const width = Dimensions.get("window").width;

@connect(
  state => ({
    listEquipment: state.equipment.contractorEquipment,
    loading: state.equipment.loading,
    user: state.auth.data,
    isLoggedIn: state.auth.userIsLoggin,
    token: state.auth.token
  }),
  dispatch =>
    bindActionCreators(
      { fetchContractorEquipment: getContractorEquipmentList },
      dispatch
    )
)
class MyEquipmenTab extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loadMore: false,
      refreshing: false,
      offset: 11
    };
  }
  // componentDidMount() {
  //   const { user } = this.props;
  //   console.log("render");
  //   this.props.fetchContractorEquipment(user.contractor.id, 0);
  // }

  // componentDidUpdate(prevProps) {
  //   const { user, token, isLoggedIn } = this.props;
  //   //Check user is login or not. If yes, fetch data
  //   if (isLoggedIn && prevProps.token !== token && token) {
  //     this.props.fetchContractorEquipment(user.contractor.id, 0);
  //   }
  // }

  // _onRefresh = async () => {
  //   const { user } = this.props;
  //   this.setState({ refreshing: true, offset: 0 });
  //   await this.props.fetchContractorEquipment(user.contractor.id, 0);
  //   this.setState({ refreshing: false });
  // console.log(res);
  // if (res) {
  //   this.setState({ refreshing: false });
  // } else {
  //   setTimeout(() => {
  //     this.setState({ refreshing: false });
  //   }, 1000);
  // }
  //};

  _renderFooter = () => {
    if (!this.state.loadMore) return null;
    return <Loading />;
  };

  _handleLoadMore = async () => {
    const { listEquipment, user } = this.props;
    const { offset, loadMore } = this.state;
    if (listEquipment.length >= offset - 1) {
      this.setState(
        {
          offset: offset + 10,
          loadMore: true
        },
        async () => {
          console.log("reqest", offset);
          await this.props.fetchContractorEquipment(user.contractor.id, offset);
          this.setState({ loadMore: false });
        }
      );
    }
  };

  renderEmptyComponent = () => {
    return (
      <TouchableOpacity>
        <Text>There is not equipment</Text>
        <Text>Create now.</Text>
      </TouchableOpacity>
    );
  };

  renderHeaderComponent = () => {
    return (
      <View style={{ marginBottom: 15 }}>
        <Dropdown
          label={"By Status"}
          defaultText={"All"}
          onSelectValue={value => this.setState({ status: value })}
          options={DROPDOWN_OPTIONS.EQUIPMENT}
          isHorizontal={true}
        />
      </View>
    );
  };

  renderItem = ({ item, index }) => {
    return (
      <EquipmentItem
        onPress={() => {
          this.props.navigation.navigate("MyEquipmentDetail", {
            id: item.id
          });
        }}
        id={item.id}
        name={item.name}
        imageURL={
          item.thumbnailImage
            ? item.thumbnailImage.url
            : "https://www.extremesandbox.com/wp-content/uploads/Extreme-Sandbox-Corportate-Events-Excavator-Lifting-Car.jpg"
        }
        address={item.address}
        price={item.dailyPrice}
      />
    );
  };

  render() {
    const { listEquipment, loading } = this.props;
    console.log("of", this.state.offset);
    return (
      <View style={styles.container}>
        <FlatList
          contentContainerStyle={{ paddingHorizontal: 15 }}
          renderItem={this.renderItem}
          data={listEquipment}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={this.renderEmptyComponent}
          ListHeaderComponent={this.renderHeaderComponent}
          // refreshing={this.state.refreshing}
          // onRefresh={this._onRefresh}
          extraData={this.state}
          getItemLayout={(data, index) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index
          })}
          // ListFooterComponent={this._renderFooter}
          // onEndReachedThreshold={0.5}
          // onEndReached={this._handleLoadMore}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default withNavigation(MyEquipmenTab);
