import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ENTITY_KEY } from 'Common/app-const';
import { fetchNotifications } from 'Redux/actions/thunks';
import { Link } from 'react-router-dom';
import { userServices } from 'Services/domain/ccp';
import { getErrorMessage, getRoutePath, getRouteFromClickAction } from 'Utils/common.utils';
import classnames from 'classnames';
import { authActions } from 'Redux/actions';
import { routeConsts } from 'Common/consts';

class Notifications extends Component {
  state = {};

  limit = 10;
  offset = 0;
  scrollBuffer = 40;
  changingNotificationIds = [];

  /**
   * Capture event scroll
   * If scroll reach bottom call load more data
   */
  _handleScroll = e => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + this.scrollBuffer;
    if (bottom) {
      this._loadMore();
    }
  };

  /**
   * Load more notification
   */
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
      offset: offset,
    });
  };

  /**
   * Mark all notifications as read
   */
  _markAllAsRead = async () => {
    const { setNotificationsCount, notifications } = this.props;

    if (this.markingAllAsRead) {
      return;
    }
    this.markingAllAsRead = true;

    try {
      await userServices.markAllNotificationsAsRead();

      const readNotificationIds = notifications.data.map(notification => notification.id);
      setNotificationsCount({
        totalUnreadNotifications: 0,
        readNotificationIds,
        unreadNotificationIds: [],
      });
      this.markingAllAsRead = false;
    } catch (error) {
      this.markingAllAsRead = false;
      console.log(error);
    }
  };

  /**
   * Request to mark notification as read or unread
   */
  _toggleReadStatus = async (e, notification) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    if (this.changingNotificationIds.includes(notification.id)) {
      return;
    }
    const { minusNotificationsCount, addNotificationsCount } = this.props;
    let { readNotificationIds, unreadNotificationIds } = this.props;

    this.changingNotificationIds.push(notification.id);
    try {
      const isUnread =
        (!notification.read && !readNotificationIds.includes(notification.id)) ||
        unreadNotificationIds.includes(notification.id);
      const result = await userServices.updateNotificationStatus(notification.id, isUnread);
      this._removeIdFromChangingList(notification.id);

      if (result.read) {
        readNotificationIds = [...readNotificationIds, notification.id];
        if (unreadNotificationIds.includes(notification.id)) {
          unreadNotificationIds = unreadNotificationIds.filter(id => id !== notification.id);
        }

        minusNotificationsCount({
          readNotificationIds,
          unreadNotificationIds,
        });
      } else {
        unreadNotificationIds = [...unreadNotificationIds, notification.id];
        if (readNotificationIds.includes(notification.id)) {
          readNotificationIds = readNotificationIds.filter(id => id !== notification.id);
        }

        addNotificationsCount({
          unreadNotificationIds,
          readNotificationIds,
        });
      }
    } catch (error) {
      const message = getErrorMessage(error);
      this._removeIdFromChangingList(notification.id);
      this.setState({ message });
    }
  };

  /**
   * Remove id of notification from changing status list
   */
  _removeIdFromChangingList = notiId => {
    this.changingNotificationIds = this.changingNotificationIds.filter(id => id !== notiId);
  };

  /**
   * After component updated
   * Check data is empty to fetch new data
   */
  componentDidUpdate() {
    const { notifications, fetchNotifications } = this.props;

    if (!notifications.data && !notifications.isFetching) {
      fetchNotifications({
        limit: this.limit,
        offset: this.offset,
      });
    }
  }

  /**
   * Render list of notification
   */
  _renderListNotifications = () => {
    const {
      notifications,
      authentication,
      readNotificationIds,
      unreadNotificationIds,
      toggle,
    } = this.props;

    if (!authentication.isAuthenticated) {
      return null;
    }

    if (!notifications.data) {
      return null;
    }

    if (notifications.data.length === 0) {
      return (
        <div className="py-3 text-center">
          <div>
            <i className="fal fa-envelope-open fa-6x text-muted mb-3" />
          </div>
          No result!
        </div>
      );
    }

    return notifications.data.map(notification => {
      const isUnread =
        (!notification.read && !readNotificationIds.includes(notification.id)) ||
        unreadNotificationIds.includes(notification.id);
      return (
        <div
          key={notification.id}
          className={classnames('dropdown-item', 'd-flex', { unread: isUnread })}
        >
          <Link
            to={getRouteFromClickAction(notification.clickAction)}
            onClick={() => {
              toggle();
              if (isUnread) {
                this._toggleReadStatus(null, notification);
              }
            }}
            className="flex-fill"
          >
            <div className="align-items-center">
              <div className={classnames('title', { 'font-weight-bold': isUnread })}>
                {notification.title}
              </div>
              <div className="title text-muted">{notification.content}</div>
            </div>
          </Link>
          <button
            className="btn btn-sm mark-as-read btn-link"
            onClick={e => this._toggleReadStatus(e, notification)}
            title={isUnread ? 'Mark as unread' : 'Mark as read'}
          >
            <i
              className={classnames('fa-circle', 'text-primary', { fas: isUnread, far: !isUnread })}
            />
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
      <div className="dropdown-menu shadow mt-2 rounded-top-0 show dropdown-menu-right">
        <div className="dropdown-item px-1 border-bottom">
          <h6 className="d-inline">Notifications</h6>
          <button className="btn btn-link float-right py-0" onClick={this._markAllAsRead}>
            Mark all as read
          </button>
          <div className="clearfix" />
        </div>
        <div className="list-notifications custom-scrollbar" onScroll={this._handleScroll}>
          {this._renderListNotifications()}
          {notifications.isFetching && (
            <div className="dropdown-item text-center">
              <div className="spinner-grow text-primary" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          )}
        </div>
        <Link
          className="dropdown-item text-center border-top"
          onClick={() => this.props.toggle()}
          to={getRoutePath(routeConsts.NOTIFICATIONS)}
        >
          View all <i className="fal fa-chevron-right" />
        </Link>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { authentication, entities } = state;
  const { unreadNotificationIds, readNotificationIds } = authentication;
  const notifications = entities[ENTITY_KEY.NOTIFICATIONS];

  return {
    authentication,
    notifications,
    unreadNotificationIds,
    readNotificationIds,
  };
};

const mapDispatchToProps = {
  fetchNotifications: fetchNotifications,
  minusNotificationsCount: authActions.minusNotificationsCount,
  addNotificationsCount: authActions.addNotificationsCount,
  setNotificationsCount: authActions.setUnreadNotificationsCount,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Notifications);
