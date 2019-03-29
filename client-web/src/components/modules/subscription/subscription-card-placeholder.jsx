import React, { Component } from 'react';
import Skeleton from 'react-loading-skeleton';

class SubscriptionCardPlaceholder extends Component {

  render() {

    return (
      <div className="subscription-card bg-white shadow p-3 my-2">
        <h2>
          <Skeleton/>
        </h2>
        <div className="text-muted">
          <Skeleton width={200}/>
        </div>
        <div className="text-muted">
          <Skeleton width={150}/>
        </div>
        <div className="text-muted">
          <Skeleton width={150}/>
        </div>
        <div className="text-muted">
          <Skeleton width={300}/>
        </div>
      </div>
    );
  }
}

export default SubscriptionCardPlaceholder;
