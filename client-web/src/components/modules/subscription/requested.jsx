import React, { Component } from "react";
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';

import { subscriptionServices } from "Services/domain/ccp";
import { getErrorMessage } from "Utils/common.utils";
import SubscriptionCard from "./subscription-card";
import SubscriptionCardPlaceholder from "./subscription-card-placeholder";
import SubscriptionCardAdd from "./subscription-card-add";

class RequestedSubscriptions extends Component {

  state = {
    subscriptions: [],
    isFetching: true
  };

  _loadData = async () => {
    try {
      const subscriptions = await subscriptionServices.getAllSubscriptionsOfContractor();
      this.setState({
        subscriptions,
        isFetching: false
      });
    } catch (error) {
      const message = getErrorMessage(error);
      this.setState({
        message,
        isFetching: false
      });
    }
  };

  componentDidMount() {
    this._loadData();
  }

  /**
   * Render list of placeholder while loading data
   */
  _renderPlaceholderCards = () => {
    const { isFetching, subscriptions } = this.state;

    if (!isFetching || subscriptions.length > 0) {
      return null;
    }

    const numOfCards = 6;
    const placeholderCards = [];
    for (let i = 0; i < numOfCards; i++) {
      placeholderCards.push(<SubscriptionCardPlaceholder key={i}/>);
    }

    return placeholderCards;
  };

  /**
   * Remove subscription from list subscriptions in state
   */
  _handleDeletedSubscription = deletedSubscription => {
    let { subscriptions } = this.state;

    subscriptions = subscriptions.filter(subscription => subscription.id !== deletedSubscription.id);
    this.setState({
      subscriptions
    });
  };

  /**
   * Update subscription to list after updated
   */
  _handleUpdatedSubscription = updatedSubscription => {
    let { subscriptions } = this.state;

    subscriptions = subscriptions.map(subscription => {
      if (subscription.id !== updatedSubscription.id) {
        return subscription;
      }

      return updatedSubscription;
    });

    this.setState({
      subscriptions
    });
  };

  /**
   * Render list of subscription cards
   */
  _renderCards = () => {
    const { subscriptions } = this.state;

    const cards = subscriptions.map(subscription => {
      return (
        <CSSTransition
          key={subscription.id}
          timeout={500}
          classNames="item"
        >
          <SubscriptionCard
            subscription={subscription}
            onDeleted={this._handleDeletedSubscription}
            onUpdated={this._handleUpdatedSubscription}
            />
        </CSSTransition>
      );
    });

    return (
      <TransitionGroup>
        {cards}
      </TransitionGroup>
    );
  };

  /**
   * Toggle add new card
   */
  _toggleAddCard = () => {
    this.setState({
      isAdding: !this.state.isAdding
    });
  };

  /**
   * Add new subcription into list
   */
  _handleCreated = createdSubscription => {
    let { subscriptions } = this.state;

    subscriptions = [
      createdSubscription,
      ...subscriptions
    ];

    this.setState({
      subscriptions,
      isAdding: false
    });
  };

  /**
   * Render add card
   */
  _renderAddCard = () => {
    const { isAdding } = this.state;

    if (!isAdding) {
      return null;
    }

    return (
      <SubscriptionCardAdd
        onCreated={this._handleCreated}
      />
    );
  };

  render() {
    return (
      <div className="container">
        <h4 className="my-3">
          My subscriptions
          <button className="btn btn-primary float-right" onClick={this._toggleAddCard}>
            <i className="fas fa-plus"></i> Add subscription
          </button>
        </h4>
        <div className="row">
          <div className="col-md-8">
            {this._renderAddCard()}
            {this._renderPlaceholderCards()}
            {this._renderCards()}
          </div>
        </div>
      </div>
    );
  }
}

export default RequestedSubscriptions;
