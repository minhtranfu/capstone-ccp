import React from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

import { routeConsts } from 'Common/consts';
import { getRoutePath } from 'Utils/common.utils';
import { formatDate } from 'Utils/format.utils';
import { Image, StarRatings } from 'Components/common';

const Feedback = ({ feedback }) => {
  const { requester } = feedback;
  
  return (
    <div key={feedback.id} className="feedback py-3 border-bottom d-flex flex-column flex-sm-row">
      <div className="d-flex">
        <Link to={getRoutePath(routeConsts.PROFILE_CONTRACTOR, { id: requester.id })}>
          <Image
            circle
            src={requester.thumbnailImageUrl}
            width={60}
            height={60}
            className="rounded-circle"
            />
        </Link>
        <span className="requester-info">
          <Link to={getRoutePath(routeConsts.PROFILE_CONTRACTOR, { id: requester.id })}>
            <h6 className="mb-1">{requester.name}</h6>
          </Link>
          <div className="text-muted">
            {formatDate(feedback.createdTime)}
          </div>
        </span>
      </div>
      <div className="flex-fill">
        <StarRatings rating={feedback.rating} />
        <div className="mt-2">
          {feedback.content}
        </div>
      </div>
    </div>
  );
};

Feedback.props = {
  feedback: PropTypes.object.isRequired,
};

export default Feedback;
