import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'bootstrap-daterangepicker/daterangepicker.css';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import { connect } from "react-redux";

import { formatDate } from 'Utils/format.utils';
import { ComponentBlocking, AddressInput } from 'Components/common';
import { subscriptionServices } from 'Services/domain/ccp';
import { getErrorMessage } from 'Utils/common.utils';
import { fetchEquipmentTypeCategories } from "Redux/actions/thunks";
import { ENTITY_KEY } from 'Common/app-const';

class SubscriptionCardAdd extends Component {

  constructor(props) {
    super(props);

    let { subscription } = this.props;
    if (!subscription) {
      subscription = {};
    }

    this.state = {
      subscription: {
        id: 'new',
        beginDate: subscription.beginDate ? moment(subscription.beginDate) : moment(),
        endDate: subscription.endDate
          ? moment(subscription.endDate)
          : (subscription.beginDate ? moment(subscription.beginDate) : moment()),
        latitude: subscription.latitude || null,
        longitude: subscription.longitude || null,
        maxDistance: subscription.maxDistance || null,
        maxPrice: subscription.maxPrice || null,
        address: subscription.address || null,
        equipmentType: {
          id: subscription.equipmentType ? subscription.equipmentType.id : 0
        }
      }
    };
  }

  componentDidMount() {
    const { equipmentTypeCategories, fetchEquipmentTypeCategories } = this.props;

    if (!equipmentTypeCategories.data || !Array.isArray(equipmentTypeCategories.data)) {
      fetchEquipmentTypeCategories();
    }
  }

  /**
   * Clear message in state
   */
  _clearMessage = () => {
    this.setState({
      message: undefined
    });
  };

  /**
   * Render message
   */
  _renderMessage = () => {
    const { message } = this.state;

    if (!message) {
      return null;
    }

    return (
      <div className="backdrop-blocking justify-content-center align-items-center flex-column">
        <div className="text-light">
          {message}
        </div>
        <div className="mt-2">
          <button className="btn btn-primary ml-2" onClick={this._clearMessage}>OK</button>
        </div>
      </div>
    );
  };

  /**
   * Handle cancel edit
   */
  _handleCancelEdit = e => {
    e.preventDefault();
    const { onCancelEdit } = this.props;
    onCancelEdit && onCancelEdit();
  };

  /**
   * Handle changing date range
   */
  _onChangeDateRanage = (e, picker) => {
    const { subscription } = this.state;
    this.setState({
      subscription: {
        ...subscription,
        beginDate: picker.startDate,
        endDate: picker.endDate
      }
    });
  };

  /**
   * Get label for show value of date range picker
   */
  _getLabelOfRange = () => {
    const { subscription } = this.state;

    if (subscription == undefined || !subscription.beginDate) {
      return 'Pick a time range';
    }

    const { beginDate, endDate } = subscription;

    return `${formatDate(beginDate)} - ${formatDate(endDate)}`;
  };

  /**
   * Update value to state when field value changed
   */
  _handleFieldChanged = e => {
    let { name, value } = e.target;
    const { subscription } = this.state;

    if (!isNaN(value)) {
      value = +value;
    }

    if (name === 'equipmentType') {
      value = {
        id: value
      };
    }

    this.setState({
      subscription: {
        ...subscription,
        [name]: value
      }
    });
  };

  /**
   * Save changes
   */
  _handleSubmitForm = async e => {
    e.preventDefault();

    const { subscription: {
      id,
      ...subscription
    },
      isFetching
    } = this.state;

    if (isFetching) {
      return;
    }

    this.setState({
      isFetching: true
    });
    try {
      subscription.beginDate = subscription.beginDate.format('YYYY-MM-DD');
      subscription.endDate = subscription.endDate.format('YYYY-MM-DD');

      const result = await subscriptionServices.postSubscription(subscription);
      this.setState({
        idFetching: false
      }, () => {
        const { onCreated } = this.props;
        onCreated && onCreated(result);
      });
    } catch (error) {
      const message = getErrorMessage(error);
      this.setState({
        message,
        isFetching: false
      });
    }
  };

  /**
   * Update address, longitude, latitude
   */
  _handleSelectAddress = ({ address, longitude, latitude }) => {
    const { subscription } = this.state;
    this.setState({
      subscription: {
        ...subscription,
        address,
        longitude,
        latitude
      }
    });
  };

  // Handle select equipment category
  _handleSelectCategory = e => {
    const { value } = e.target;
    const { subscription } = this.state;
    this.setState(
      {
        selectedCategoryId: +value,
        subscription: {
          ...subscription,
          equipmentType: {
            id: 0
          }
        }
      }
    );
  };

  render() {
    const { isFetching, subscription } = this.state;
    let { selectedCategoryId } = this.state;
    const { equipmentTypeCategories } = this.props;

    const typeCategories = equipmentTypeCategories.data || [];
    let equipmentTypes = [];
    const categoryOptions = typeCategories.map(category => {
      if (!selectedCategoryId) {
        category.equipmentTypes.forEach(equipmentType => {
          equipmentTypes.push(equipmentType);

          if (subscription.equipmentType && equipmentType.id === +subscription.equipmentType.id) {
            selectedCategoryId = category.id;
          }
        });
        
      } else if (selectedCategoryId === category.id) {
        equipmentTypes = category.equipmentTypes;
      }

      return (<option key={category.id} value={category.id}>{category.name}</option>);
    });

    return (
      <div className="subscription-card bg-white shadow-sm p-3 my-2 position-relative">
        {isFetching &&
          <ComponentBlocking />
        }
        {this._renderMessage()}
        <form onSubmit={this._handleSubmitForm}>
          <div className="form-group row">
            <label htmlFor={`equipment_type_category_${subscription.id}`} className="col-md-3 col-form-label">Equipment type category: </label>
            <div className="col-md-9">
              <select name="equipmentType" value={selectedCategoryId} onChange={this._handleSelectCategory} id={`equipment_type_category_${subscription.id}`} className="form-control">
                <option value="0">Choose a type category...</option>
                {categoryOptions}
              </select>
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor={`equipment_type_${subscription.id}`} className="col-md-3 col-form-label">Equipment type:</label>
            <div className="col-md-9">
              <select name="equipmentType" onChange={this._handleFieldChanged} value={subscription.equipmentType.id} id={`equipment_type_${subscription.id}`} className="form-control">
                <option value="0">Choose a equipment type...</option>
                {equipmentTypes.map(type => {

                  return (<option key={type.id} value={type.id}>{type.name}</option>);
                })}
              </select>
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor={`timerange_${subscription.id}`} className="col-md-3 col-form-label">Time range:</label>
            <div className="col-md-9">
              <DateRangePicker minDate={moment()} onApply={this._onChangeDateRanage} containerClass="w-100" data-range-id="1" startDate={subscription.beginDate} endDate={subscription.endDate}>
                <div className="input-group date-range-picker">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="basic-addon2"><i className="fal fa-calendar"></i></span>
                  </div>
                  <input type="text" id="timeRange" className="form-control" readOnly value={this._getLabelOfRange() || ''} />
                </div>
              </DateRangePicker>
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor={`max_price_${subscription.id}`} className="col-md-3 col-form-label">Max price(K):</label>
            <div className="col-md-9">
              <input
                type="number" className="form-control"
                min={1}
                id={`max_price_${subscription.id}`}
                name="maxPrice"
                value={subscription.maxPrice}
                onChange={this._handleFieldChanged}
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor={`max_dicstance_${subscription.id}`} className="col-md-3 col-form-label">Max distance(Km):</label>
            <div className="col-md-9">
              <input
                type="number" className="form-control"
                min={1}
                id={`max_dicstance_${subscription.id}`}
                name="maxDistance"
                value={subscription.maxDistance}
                onChange={this._handleFieldChanged}
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor={`address_${subscription.id}`} className="col-md-3 col-form-label">Address:</label>
            <div className="col-md-9">
              <AddressInput
                inputProps={{ id: `address_${subscription.id}` }}
                address={subscription.address}
                onSelect={this._handleSelectAddress}
              />
            </div>
          </div>
          <div className="form-group text-center">
            <button type="submit" className="btn btn-primary">Add</button>
            <button type="button" className="btn btn-outline-primary ml-2" onClick={this._handleCancelEdit}>Cancel</button>
          </div>
        </form>
      </div>
    );
  }
}

SubscriptionCardAdd.props = {
  subscription: PropTypes.object,
  onCancelEdit: PropTypes.func,
  onCreated: PropTypes.func,
  equipmentTypeCategories: PropTypes.array,
  fetchEquipmentTypeCategories: PropTypes.func
};

const mapStateToProps = state => {
  const { entities } = state;
  const equipmentTypeCategories = entities[ENTITY_KEY.EQUIPMENT_TYPE_CATEGORIES];

  return {
    equipmentTypeCategories
  };
};

const mapDispatchToProps = {
  fetchEquipmentTypeCategories
};

export default connect(mapStateToProps, mapDispatchToProps)(SubscriptionCardAdd);
