import React, { Component } from 'react';
import { connect } from "react-redux";
import firebase from 'firebase/app';
import 'firebase/messaging';
import classnames from 'classnames';
import moment from "moment";
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Notification from './Notification';

class NotificationRoot extends Component {
  state = {
    notifications: []
  };

  _handleReceivedNewNotification = payload => {
    const { notifications } = this.state;
    payload.notification.id = notifications.length + 1;
    payload.notification.time = moment();
    this.setState({
      notifications: [
        ...notifications,
        payload.notification
      ]
    })
  };

  componentDidMount() {
    firebase.messaging().onMessage(this._handleReceivedNewNotification);
  }

  _removeNotificationByIndex = id => {
    let { notifications } = this.state;
    notifications = notifications.filter(notification => notification.id !== id);

    this.setState({
      notifications
    });
  };

  render() {
    const { notifications } = this.state;
    const className = classnames('notification-container', {
      'notification-container-empty': notifications.length === 0
    });

    return (
      <TransitionGroup className={className}>
        {notifications.map(notification => (
          <CSSTransition
            classNames="notification"
            timeout={{ enter: 400, exit: 400 }}
            key={notification.id}
          >
            <Notification notification={notification} onClose={() => this._removeNotificationByIndex(notification.id)} />
          </CSSTransition>
        ))
        }
      </TransitionGroup>
    );
  }
}

export default connect()(NotificationRoot);