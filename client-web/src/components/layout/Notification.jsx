import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getRouteFromClickAction } from 'Utils/common.utils';

class Notification extends PureComponent {
  componentDidMount() {
    const { onClose } = this.props;

    if (onClose) {
      setTimeout(() => {
        onClose();
      }, 10000);
    }
  }

  render() {
    const { onClose, notification } = this.props;

    console.log(notification);

    return (
      <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
        <Link to={getRouteFromClickAction(notification.clickAction)}>
          <div className="toast-header">
            <svg
              className="bd-placeholder-img rounded mr-2"
              width="20"
              height="20"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid slice"
              focusable="false"
              role="img"
            >
              <rect fill="#007aff" width="100%" height="100%" />
            </svg>
            <strong className="mr-auto">{notification.title}</strong>
            <small className="text-muted">just now</small>
            <button onClick={onClose} type="button" className="ml-2 mb-1 close" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="toast-body">{notification.body}</div>
        </Link>
      </div>
    );
  }
}

Notification.props = {
  onClose: PropTypes.func,
  notification: PropTypes.object,
};

export default Notification;
