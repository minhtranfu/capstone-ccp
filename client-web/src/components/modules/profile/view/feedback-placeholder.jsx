import React from 'react';
import Skeleton from 'react-loading-skeleton';

const FeedbackPlacholder = () => {
  return (
    <div className="feedback py-3 border-bottom d-flex flex-column flex-sm-row">
      <div className="d-flex">
        <Skeleton circle width={60} height={60} />
        <span className="requester-info">
          <Skeleton width={120}/>
          <div className="text-muted">
            <Skeleton width={100}/>
          </div>
        </span>
      </div>
      <div className="flex-fill">
        <Skeleton width={120} height={20}/>
        <div className="mt-2">
          <Skeleton count={2} />
        </div>
      </div>
    </div>
  );
};

export default FeedbackPlacholder;
