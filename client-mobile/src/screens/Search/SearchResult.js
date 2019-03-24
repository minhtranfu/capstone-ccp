import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  FlatList,
  Modal,
  Alert,
  Dimensions,
  TextInput
} from 'react-native'
import { SafeAreaView } from 'react-navigation'
import { connect } from 'react-redux'
import { Feather } from '@expo/vector-icons'
import {
  searchEquipment,
  clearSearchResult
} from '../../redux/actions/equipment'
import { addSubscription } from '../../redux/actions/subscription'

import Calendar from '../../components/Calendar'
import Header from '../../components/Header'
import Loading from '../../components/Loading'
import EquipmentItem from '../../components/EquipmentItem'

import colors from '../../config/colors'
import fontSize from '../../config/fontSize'

const ITEM_HEIGHT = 217
const width = Dimensions.get('window').width

@connect(
  state => ({
    status: state.status,
    loading: state.equipment.searchLoading,
    listSearch: state.equipment.listSearch
  }),
  dispatch => ({
    fetchSearchEquipment: (
      address,
      long,
      lat,
      beginDate,
      endDate,
      equipmentTypeId
    ) => {
      dispatch(
        searchEquipment(address, long, lat, beginDate, endDate, equipmentTypeId)
      )
    },
    fetchClearSearchEquipment: () => {
      dispatch(clearSearchResult())
    }
  })
)
class SearchResult extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modalVisible: true,
      filterModalVisible: false,
      calendarVisible: false,
      fromDate: '',
      toDate: ''
    }
  }

  componentDidMount() {
    const {
      query,
      lat,
      long,
      beginDate,
      endDate,
      equipmentTypeId
    } = this.props.navigation.state.params
    const fullAddress = query.main_text.concat(', ', query.secondary_text)
    this.props.fetchSearchEquipment(
      query.main_text,
      lat,
      long,
      beginDate,
      endDate,
      equipmentTypeId
    )
    this.setState({ fromDate: beginDate, toDate: endDate })
  }

  _showAlert = (title, msg) => {
    Alert.alert(title, msg, [{ text: 'OK' }], {
      cancelable: true
    })
  }

  _setModalVisible = visible => {
    this.setState({ modalVisible: visible })
  }

  _setFilterModalVisible = visible => {
    this.setState({ filterModalVisible: visible })
  }

  _setCalendarVisible = visible => {
    this.setState({ calendarVisible: visible, modalVisible: !visible })
  }

  _handleDateFormat = date => {
    let dateFormat = new Date(date)
    year = dateFormat.getFullYear()
    month = dateFormat.getMonth() + 1
    dt = dateFormat.getDate()
    if (dt < 10) {
      dt = '0' + dt
    }
    if (month < 10) {
      month = '0' + month
    }
    return year + '-' + month + '-' + dt
  }

  _formatDate = date => {
    var monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ]
    let newDate = new Date(date)
    let year = newDate.getFullYear()
    let monthIndex = newDate.getMonth()
    let day = newDate.getDate()

    let newYear = year === 2019 ? '' : ',' + year
    return monthNames[monthIndex] + ' ' + day + newYear
  }

  _handleSubmitSearch = () => {
    const {
      query,
      lat,
      long,
      beginDate,
      endDate,
      equipmentTypeId
    } = this.props.navigation.state.params
    const { fromDate, toDate } = this.state

    console.log(
      'ahihi search submit',
      query.main_text,
      lat,
      long,
      fromDate,
      toDate,
      equipmentTypeId,
      beginDate,
      endDate
    )
    if (fromDate && toDate) {
      this.props.fetchSearchEquipment(
        query.main_text,
        lat,
        long,
        fromDate ? fromDate : beginDate,
        toDate ? toDate : endDate,
        equipmentTypeId
      )
    }
    this._setModalVisible(!this.state.modalVisible)
  }

  _handleAddMoreMonth = (date, month) => {
    let today = new Date(date)
    let result = today.setMonth(today.getMonth() + month)
    return result
  }

  _onSelectDate = (fromDate, toDate, visible) => {
    const newToDate = toDate ? toDate : this._handleAddMoreMonth(fromDate, 6)
    this.setState({
      fromDate,
      toDate: this._handleDateFormat(newToDate),
      calendarVisible: visible,
      modalVisible: !visible
    })
  }

  _renderCalendar = (beginDate, endDate) => (
    <Calendar
      visible={this.state.calendarVisible}
      onLeftButtonPress={() => this._setCalendarVisible(false)}
      onSelectDate={this._onSelectDate}
      fromDate={beginDate}
      endDate={endDate}
    />
  )

  _renderSearchModal = () => {
    const { query } = this.props.navigation.state.params
    const { fromDate, toDate } = this.state
    return (
      <Modal transparent={true} visible={this.state.modalVisible}>
        <TouchableOpacity
          activeOpacity={0}
          style={styles.modalContainer}
          onPress={() => this._setModalVisible(false)}
        >
          <SafeAreaView
            forceInset={{ bottom: 'always', top: 'always' }}
            style={styles.modalWrapper}
          >
            <View style={{ paddingHorizontal: 15 }}>
              <TouchableOpacity
                style={styles.rowWrapper}
                onPress={() => {
                  this.props.navigation.navigate('Search')
                  this._setModalVisible(false)
                }}
              >
                <Text style={styles.text}>Location</Text>
                <Text style={styles.text}> {query.main_text}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.rowWrapper}
                onPress={() => this._setCalendarVisible(true)}
              >
                <Text style={styles.text}>From</Text>
                <Text style={styles.text}>{this._formatDate(fromDate)}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.rowWrapper, { borderBottomWidth: 0 }]}
                onPress={() => this._setCalendarVisible(true)}
              >
                <Text style={styles.text}>To</Text>
                <Text style={styles.text}>{this._formatDate(toDate)}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.buttonWrapper}
              onPress={() => {
                this._handleSubmitSearch()
              }}
            >
              <Text style={[styles.text, { color: 'white' }]}>
                Find equipment
              </Text>
            </TouchableOpacity>
          </SafeAreaView>
        </TouchableOpacity>
      </Modal>
    )
  }

  _renderFilterModal = () => {
    return (
      <Modal transparent={true} visible={this.state.filterModalVisible}>
        <View style={styles.filterContainer}>
          <View style={styles.filterWrapper}>
            <TouchableOpacity
              style={{
                alignSelf: 'flex-end',
                marginRight: 15
              }}
              onPress={() => this._setFilterModalVisible(false)}
            >
              <Text style={styles.textDone}>Done</Text>
            </TouchableOpacity>
            <View style={styles.rowWrapper}>
              <Text style={styles.text}>Sort By</Text>
              <Text style={styles.text}>Desc | Asc </Text>
            </View>
            <View>
              <Text>Hello World!</Text>

              <TouchableHighlight
                onPress={() => {
                  this._setFilterModalVisible(!this.state.filterModalVisible)
                }}
              >
                <Text>Hide Modal</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>
    )
  }

  _renderItem = ({ item }) => {
    const { query } = this.props.navigation.state.params
    return (
      <EquipmentItem
        onPress={() =>
          this.props.navigation.navigate('SearchDetail', {
            id: item.equipmentEntity.id,
            query: query
          })
        }
        key={`eq_${item.equipmentEntity.id}`}
        id={item.equipmentEntity.id}
        name={item.equipmentEntity.name}
        contractor={item.equipmentEntity.contractor.name}
        timeRange={item.equipmentEntity.availableTimeRanges[0]}
        imageURL={
          item.equipmentEntity.thumbnailImage
            ? item.equipmentEntity.thumbnailImage.url
            : 'https://www.extremesandbox.com/wp-content/uploads/Extreme-Sandbox-Corportate-Events-Excavator-Lifting-Car.jpg'
        }
        address={item.equipmentEntity.address}
        price={item.equipmentEntity.dailyPrice}
      />
    )
  }

  formatDateMonth = date => {
    const dates = date.split('-')
    const month = dates[1]
    if (month.length >= 2) {
      return `${dates[0]}-${month}-${dates[2]}`
    } else {
      return `${dates[0]}-0${month}-${dates[2]}`
    }
  }

  renderAddSubscription = () => {
    const {
      query,
      beginDate,
      endDate,
      equipmentTypeId
    } = this.props.navigation.state.params
    const { fromDate, toDate } = this.state
    const subscriptionInfo = {
      beginDate: this.formatDateMonth(fromDate ? fromDate : beginDate),
      endDate: this.formatDateMonth(toDate ? toDate : endDate),
      equipmentType: {
        id: equipmentTypeId
      },
      latitude: query.lat,
      longitude: query.lng
    }

    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Text style={{ textAlign: 'center', marginBottom: 5 }}>
          Not Available Equipment. Please subscribe and we will notify to you
          when it is available
        </Text>

        <View style={{ alignItems: 'center', marginBottom: 10 }}>
          <Text>Location: {query.main_text}</Text>
          <Text>
            (lat: {subscriptionInfo.latitude} / lng:{' '}
            {subscriptionInfo.longitude})
          </Text>
          <Text>beginDate: {subscriptionInfo.beginDate}</Text>
          <Text>endDate: {subscriptionInfo.endDate}</Text>
          <TextInput
            placeholder={'max distance'}
            keyboardType="numeric"
            style={{
              width: 200,
              padding: 5,
              borderWidth: 0.5,
              marginBottom: 5
            }}
            ref={node => (this.maxDistance = node)}
          />
          <TextInput
            placeholder={'max price'}
            keyboardType="numeric"
            style={{
              width: 200,
              padding: 5,
              borderWidth: 0.5,
              marginBottom: 5
            }}
            ref={node => (this.maxPrice = node)}
          />

          <TouchableOpacity
            style={{
              backgroundColor: 'green',
              alignItems: 'center',
              width: 200,
              padding: 10
            }}
            onPress={() => {
              const info = {
                ...subscriptionInfo,
                maxDistance: this.maxDistance._lastNativeText,
                maxPrice: this.maxPrice._lastNativeText
              }
              addSubscription(info).then(() => {
                this.props.navigation.navigate('Account')
              })
            }}
          >
            <Text style={{ color: '#ffffff' }}>Subscribed</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  render() {
    const { listSearch, loading } = this.props
    const { query, beginDate, endDate } = this.props.navigation.state.params
    //const result = this._findResultByAddress(equipment);
    console.log('ahihi', listSearch)
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: 'always', top: 'always' }}
      >
        <Header
          renderLeftButton={() => (
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.goBack()
              }}
            >
              <Feather name="arrow-left" size={24} />
            </TouchableOpacity>
          )}
          renderRightButton={() => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                style={{ marginRight: 10 }}
                onPress={() => {
                  this.setState({ modalVisible: true })
                }}
              >
                <Feather name="search" size={24} />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ marginRight: 10 }}
                onPress={() => {
                  this.setState({ filterModalVisible: true })
                }}
              >
                <Feather name="sliders" size={24} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Cart')}
              >
                <Feather name="shopping-cart" size={24} />
              </TouchableOpacity>
            </View>
          )}
        >
          <TouchableOpacity
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 200
            }}
            onPress={() => this._setModalVisible(true)}
          >
            <Text style={styles.text} numberOfLines={1}>
              {query.main_text}
            </Text>
            <Text style={styles.caption}>
              {this._formatDate(beginDate) + ' - ' + this._formatDate(endDate)}
            </Text>
          </TouchableOpacity>
        </Header>

        {!loading ? (
          <View style={{ flex: 1 }}>
            {this._renderSearchModal()}
            {this._renderFilterModal()}
            {this._renderCalendar(beginDate, endDate)}
            {listSearch.length > 0 ? (
              <FlatList
                style={{ paddingTop: 15, paddingHorizontal: 15 }}
                data={listSearch}
                removeClippedSubviews={false}
                renderItem={this._renderItem}
                getItemLayout={(data, index) => ({
                  length: ITEM_HEIGHT,
                  offset: ITEM_HEIGHT * index,
                  index
                })}
                keyExtractor={(item, index) => index.toString()}
              />
            ) : (
              this.renderAddSubscription()
            )}
          </View>
        ) : (
          <Loading />
        )}
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.4)'
  },
  filterContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)'
  },
  modalWrapper: {
    borderRadius: 5,
    width: width,
    height: 160,
    backgroundColor: 'white'
  },
  filterWrapper: {
    borderRadius: 5,
    width: width,
    height: 200,
    backgroundColor: 'white',
    paddingHorizontal: 15
  },
  rowWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    paddingVertical: 10
  },
  buttonWrapper: {
    backgroundColor: 'green',
    width: width,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: fontSize.h4,
    fontWeight: '600'
  },
  caption: {
    fontSize: fontSize.caption,
    fontWeight: '400'
  },
  text: {
    fontSize: fontSize.bodyText,
    fontWeight: '500'
  },
  textDone: {
    fontWeight: '500',
    fontSize: fontSize.bodyText,
    color: colors.secondaryColor,
    paddingTop: 15,
    paddingBottom: 15
  }
})

export default SearchResult
