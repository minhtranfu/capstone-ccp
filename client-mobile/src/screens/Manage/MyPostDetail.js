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
import moment  from "moment";
import {
  addTypeServices,
  removeTypeServices,
  clearTypeServices,
  editArticle
} from "../../redux/actions/debris";
import Feather from "@expo/vector-icons/Feather";

import AutoComplete from '../../components/AutoComplete';
import Button from "../../components/Button";
import Header from "../../components/Header";
import InputField from "../../components/InputField";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";
import Title from '../../components/Title';

const Bid = ({ bid }) => {
  const {
    createdTime,
    description,
    price,
    status,
    supplier,
  } = bid;
  return (
    <View style={{paddingBottom: 5, paddingTop: 15, ...colors.shadow, backgroundColor: 'white', paddingHorizontal: 15, borderRadius: 10, marginBottom: 15, marginTop: 5 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={styles.bidSupplierName}>{supplier.name}</Text>
          <Text style={styles.bidTime}>{moment(createdTime).fromNow()}</Text>
        </View>
        <Text style={styles.bidPrice}>{`${price}k VND`}</Text>
      </View>
      <Text style={styles.bidDescription}>{description}</Text>
      <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.text50, padding: 10}}>
        <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: colors.text25, padding: 8, borderRadius: 5 }}>
          <Feather name={'thumbs-up'} size={16} color={'green'}/>
          <Text style={{ marginLeft: 3, color: colors.text, fontSize: fontSize.secondaryText, fontWeight: '500'}}>
            Accept
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  )
};

@connect(
  (state, ownProps) => {
    const { id } = ownProps.navigation.state.params;
    return {
      postDetail: state.debris.debrisArticles.find(item => item.id === id),
      typeServices: state.debris.typeServices
    };
  },
  dispatch => ({
    addTypeServices: data => dispatch(addTypeServices(data)),
    fetchRemoveTypeServices: id => {
      dispatch(removeTypeServices(id));
    },
    fetchClearTypeServices: () => {
      dispatch(clearTypeServices());
    },
    fetchEditArticle: (articleId, article) => {
      dispatch(editArticle(articleId, article));
    }
  })
)
class MyPostDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      postDetail: {},
      title: "",
      address: "",
      debrisServiceTypes: []
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    //Check data is update
    if (
      Object.keys(prevState.postDetail).length === 0 &&
      nextProps.postDetail !== prevState.postDetail
    ) {
      return {
        postDetail: nextProps.postDetail
      };
    }
    return null;
  }

  componentDidMount() {
    this.props.addTypeServices(this.props.postDetail.debrisServiceTypes);
  }

  componentWillUnmount() {
    this.props.fetchClearTypeServices();
  }

  _handleInputChanged = (field, value) => {
    this.setState({
      data: {
        ...this.state.postDetail,
        [field]: value
      }
    });
  };

  _handleSubmitEdit = () => {
    const { postDetail } = this.state;
    const { typeServices } = this.props;
    const article = {
      title: postDetail.title,
      address: postDetail.address,
      latitude: 10.001,
      longitude: 106.121313,
      debrisServiceTypes: typeServices.map(item => {
        return { id: item.id };
      })
    };
    this.props.fetchEditArticle(postDetail.id, article);
    this.props.navigation.goBack();
  };

  _renderContent = () => {
    const { postDetail, editMode } = this.state;
    const bids = postDetail.debrisBids;

    const { typeServices } = this.props;
    return (
      <View>
        <Title title={"Information"}/>
        <InputField
          label={"Tittle"}
          placeholder={"Input your title"}
          placeholderTextColor={colors.text68}
          customWrapperStyle={{ marginBottom: 15 }}
          inputType="text"
          onChangeText={value => this._handleInputChanged("title", value)}
          value={postDetail.title}
          returnKeyType={"next"}
          editable={editMode}
        />
        <InputField
          label={"Address"}
          placeholder={"Input your address"}
          placeholderTextColor={colors.text68}
          customWrapperStyle={{ marginBottom: 15 }}
          inputType="text"
          onChangeText={value => this._handleInputChanged("address", value)}
          value={postDetail.address}
          returnKeyType={"next"}
          editable={editMode}
        />
        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: -10}}>
        <Title title={"Service Requirement Types"}/>
          {editMode && (
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={() => this.props.navigation.navigate("AddServicesTypes")}
            >
              <Feather name="plus-circle" size={20} />
            </TouchableOpacity>
          )}

        </View>

        <View>
          {typeServices !== undefined && typeServices.length > 0 ? (
            typeServices.map(item => (
              <View style={styles.rowTypeWrapper} key={item.id}>
                <Text style={styles.text}>{item.name}</Text>
                <TouchableOpacity
                  onPress={() => this.props.fetchRemoveTypeServices(item.id)}
                >
                  <Text style={styles.text}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No service information provided</Text>
          )}
          {!editMode && (
            <Title title={`Bids (${bids.length})`}/>
          )}
          {
            !editMode && bids.map(bid => <Bid key={bid.id.toString()} bid={bid}/>)
          }

        </View>
      </View>
    );
  };

  render() {
    const { editMode } = this.state;
    const { navigation } = this.props;
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ top: "always", bottom: 'none' }}
      >
        <Header
          renderLeftButton={() => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather name="arrow-left" size={24} />
            </TouchableOpacity>
          )}
          renderRightButton={() => (
            editMode ?
            <TouchableOpacity onPress={() => this.setState({editMode: !this.state.editMode})}>
              <Text style={{fontWeight: '500', color: colors.text, fontSize: fontSize.bodyText}}>
                Cancel
              </Text>
            </TouchableOpacity> :
              <TouchableOpacity onPress={() => this.setState({editMode: !this.state.editMode})}>
                <Text style={{fontWeight: '500', color: colors.text, fontSize: fontSize.bodyText}}>
                  Edit
                </Text>
              </TouchableOpacity>
          )}
        >
          <Text style={styles.header}>Post Detail</Text>
        </Header>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 15 }}>
          {this._renderContent()}
        </ScrollView>
        {editMode && (
          <SafeAreaView
            forceInset={{ bottom: "always", }}
            style={{backgroundColor: colors.primaryColor}}
          >
            <Button
              text={"Save"}
              disabled={!editMode}
              bordered={false}
              onPress={() => this._handleSubmitEdit()}
            />
          </SafeAreaView>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  rowTypeWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  text: {
    fontSize: fontSize.bodyText,
    fontWeight: "500",
    color: colors.text,
  },
  emptyText: {
    fontSize: fontSize.secondaryText,
    color: colors.text50,
    fontWeight: "400"
  },
  header: {
    color: colors.primaryColor,
    fontSize: fontSize.bodyText,
    fontWeight: "600"
  },
  bidSupplierName: {
    fontSize: fontSize.bodyText,
    color: colors.text,
    fontWeight: "600"
  },
  bidTime: {
    fontSize: fontSize.caption,
    color: colors.text50,
    fontWeight: "400"
  },
  bidDescription: {
    fontSize: fontSize.bodyText,
    color: colors.text,
    fontWeight: "400",
    marginBottom: 10,
  },
  bidPrice: {
    fontSize: fontSize.bodyText,
    color: colors.secondaryColor,
    fontWeight: "700"
  }
});

export default MyPostDetail;
