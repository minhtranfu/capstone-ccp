import React, { Component } from 'react';
import { connect } from "react-redux";
import { ENTITY_KEY } from 'Common/app-const';
import { fetchNotifications } from 'Redux/actions/thunks';
import { Link } from "react-router-dom";
import { userServices } from 'Services/domain/ccp';
import { getErrorMessage } from 'Utils/common.utils';
import classnames from 'classnames';
import { authActions } from 'Redux/actions';

class Notifications extends Component {

  state = {
    readNotificationIds: [],
    unreadNotificationIds: []
  };

  limit = 10;
  offset = 0;
  scrollBuffer = 40;
  changingNotificationIds = [];

  _handleScroll = (e) => {

    const bottom = e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + this.scrollBuffer;
    if (bottom) {
      this._loadMore();
    }
  }

  _loadMore = () => {
    const { notifications, fetchNotifications } = this.props;

    if (notifications.isFetching) {
      return;
    }

    // Check there are more notifications
    const offset = notifications.data.length;
    if (offset % this.limit !== 0 || offset !== this.offset + this.limit) {
      return;
    }
    this.offset += this.limit;

    fetchNotifications({
      limit: this.limit,
      offset: offset
    });
  };

  _toggleReadStatus = async (e, notification) => {
    e.preventDefault();
    if (this.changingNotificationIds.includes(notification.id)) {
      return;
    }
    const { minusNotificationsCount, addNotificationsCount } = this.props;
    let { readNotificationIds, unreadNotificationIds } = this.state;

    this.changingNotificationIds.push(notification.id);
    try {
      const isUnread = !notification.read && !readNotificationIds.includes(notification.id) || unreadNotificationIds.includes(notification.id);
      const result = await userServices.updateNotificationStatus(notification.id, isUnread);
      this._removeIdFromChangingList(notification.id);

      if (result.read) {
        readNotificationIds = [
          ...readNotificationIds,
          notification.id
        ];
        if (unreadNotificationIds.includes(notification.id)) {
          unreadNotificationIds = unreadNotificationIds.filter(id => id !== notification.id);
        }

        this.setState({
          readNotificationIds,
          unreadNotificationIds
        });

        minusNotificationsCount();

      } else {

        unreadNotificationIds = [
          ...unreadNotificationIds,
          notification.id
        ];
        if (readNotificationIds.includes(notification.id)) {
          readNotificationIds = readNotificationIds.filter(id => id !== notification.id);
        }

        this.setState({
          unreadNotificationIds,
          readNotificationIds
        });

        addNotificationsCount();
      }
    } catch (error) {
      const message = getErrorMessage(error);
      this._removeIdFromChangingList(notification.id);
      this.setState({ message });
    }
  };

  _removeIdFromChangingList = notiId => {
    this.changingNotificationIds = this.changingNotificationIds.filter(id => id !== notiId);
  };

  componentDidUpdate() {
    const { notifications, fetchNotifications } = this.props;

    if (!notifications.data && !notifications.isFetching) {
      fetchNotifications({
        limit: this.limit,
        offset: this.offset
      });
    }

  }

  _renderListNotifications = () => {
    const { readNotificationIds, unreadNotificationIds } = this.state;
    const { notifications, authentication } = this.props;

    if (!authentication.isAuthenticated) {
      return null;
    }

    if (!notifications.data) {
      return null;
    }

    return notifications.data.map(notification => {
      const isUnread = !notification.read && !readNotificationIds.includes(notification.id) || unreadNotificationIds.includes(notification.id);
      return (
        <div key={notification.id} className={classnames('dropdown-item', 'd-flex', {'unread': isUnread})}>
          <a href="/" className="flex-fill">
            <div className="align-items-center">
              <div className={classnames('title', { 'font-weight-bold': isUnread })}>
                {notification.title} <span className="text-muted">{notification.content}</span>
              </div>
            </div>
          </a>
          <button className="btn btn-sm mark-as-read btn-link" onClick={e => this._toggleReadStatus(e, notification)} title="Mark as read">
            <i className={classnames('fa-circle', 'text-primary', {fas: isUnread, far: !isUnread})}></i>
          </button>
        </div>
      );
    });
  };

  render() {
    const { notifications, isShow } = this.props;

    if (!isShow) {
      return null;
    }

    return (
      <div className="dropdown-menu shadow mt-2 rounded-top-0 show">
        <div className="list-notifications custom-scrollbar" onScroll={this._handleScroll}>
          {this._renderListNotifications()}
          {notifications.isFetching &&
            <div className="dropdown-item text-center">
              <div className="spinner-grow text-primary" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          }
        </div>
        <Link className="dropdown-item text-center border-top" to="/debrises">View all <i className="fal fa-chevron-right"></i></Link>
      </div>
    );
  }
}


const mapStateToProps = state => {
  const { authentication, entities } = state;
  const notifications = entities[ENTITY_KEY.NOTIFICATIONS];

  return {
    authentication,
    notifications
  };
};

const mapDispatchToProps = {
  fetchNotifications: fetchNotifications,
  minusNotificationsCount: authActions.minusNotificationsCount,
  addNotificationsCount: authActions.addNotificationsCount
};

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
