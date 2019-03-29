import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { formatDate, formatPrice } from 'Utils/format.utils';
import { ComponentBlocking } from 'Components/common';
import { subscriptionServices } from 'Services/domain/ccp';
import { getErrorMessage } from 'Utils/common.utils';
import SubscriptionCardEditing from './subscription-card-editing';

class SubscriptionCard extends Component {

  state = {
    isDeleting: false
  };

  /**
   * Set state to show sweet alert confirm modal
   */
  _toggleConfirmToDelete = () => {
    this.setState({
      isDeleting: !this.state.isDeleting
    });
  };

  /**
   * Render confirm to delete
   */
  _renderConfirmToDelete = () => {
    const { isDeleting } = this.state;

    if (!isDeleting) {
      return null;
    }

    return (
      <div className="backdrop-blocking justify-content-center align-items-center flex-column">
        <div className="text-light">
          Confirm to delete this subscription. This action cannot be undone!
        </div>
        <div className="mt-2">
          <button className="btn btn-danger" onClick={this._deleteSubscription}>Delete</button>
          <button className="btn btn-outline-primary ml-2" onClick={this._toggleConfirmToDelete}>Cancel</button>
        </div>
      </div>
    );
  };

  /**
   * Fire onDeleted event
   */
  _handleDeleted = () => {
    const { onDeleted, subscription } = this.props;
    onDeleted && onDeleted(subscription);
  };

  /**
   * Delete current subscription
   */
  _deleteSubscription = async () => {
    const { subscription } = this.props;

    try {
      this.setState({
        isFetching: true,
        isDeleting: false
      });
      const deleteResult = await subscriptionServices.deleteSubscription(subscription.id);

      if (deleteResult && deleteResult.message) {
        const message = deleteResult.message;
        this.setState({
          message,
          isFetching: false
        });

        return;
      }

      this._handleDeleted();
    } catch (error) {
      const message = getErrorMessage(error);
      this.setState({
        isFetching: false,
        message
      });
    }
  };

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
   * Toggle isEdditing state
   */
  _toggleEdit = () => {
    this.setState({
      isEditing: !this.state.isEditing
    });
  };

  /**
   * Change isEditing to hide edit form
   * Fire onUpdated event
   */
  _handleUpdated = updatedSubscription => {
    const { onUpdated } = this.props;
    
    // Fire onUpdated event
    onUpdated && onUpdated(updatedSubscription);

    // Hide edit form
    this.setState({
      isEditing: false
    });
  };

  render() {
    const { isFetching, isEditing } = this.state;
    const { subscription } = this.props;
    
    if (isEditing) {
      return (
        <SubscriptionCardEditing
          subscription={subscription}
          onUpdated={this._handleUpdated}
          onCancelEdit={() => this._toggleEdit()}
        />
      );
    }

    return (
      <div className="subscription-card bg-white shadow p-3 my-2 position-relative">
        {isFetching &&
          <ComponentBlocking/>
        }
        {this._renderConfirmToDelete()}
        {this._renderMessage()}
        <h2 className="d-inline">
          {subscription.equipmentType.name}
        </h2>
        <span className="float-right">
          <button className="btn btn-sm btn-outline-primary" onClick={this._toggleEdit}>
            <i className="fal fa-edit"></i>
          </button>
          <button className="btn btn-sm btn-outline-danger ml-2" onClick={this._toggleConfirmToDelete}>
            <i className="fal fa-trash"></i>
          </button>
        </span>
        <div className="text-muted">
          <i className="fal fa-calendar"></i> {formatDate(subscription.beginDate)} - {formatDate(subscription.endDate)}
        </div>
        <div className="text-muted">
          <i className="fal fa-dollar-sign"></i> Max price: {formatPrice(subscription.maxPrice)}
        </div>
        <div className="text-muted">
          <i className="fal fa-map-marker-alt"></i> Max distance: {subscription.maxDistance} Km
        </div>
        <div className="text-muted">
          <i className="fal fa-map-marker"></i> Address: {subscription.address}
        </div>
      </div>
    );
  }
}

SubscriptionCard.props = {
  subscription: PropTypes.object.isRequired,
  onDeleted: PropTypes.func
};

export default SubscriptionCard;
