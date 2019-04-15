import React from 'react';
import Skeleton from 'react-loading-skeleton';

import { Image } from 'Components/common';
import { getRoutePath } from 'Utils/common.utils';
import { routeConsts } from 'Common/consts';

export default ({ contractor, ratingType }) => {
  
  return (
    <div className="constructor-card text-center">
      {contractor && contractor.thumbnailImageUrl
        ? <Image
          circle
          src={contractor.thumbnailImageUrl}
          width={125}
          height={125}
          className="rounded-circle"
          alt={`${contractor.name}'s avatar`}
        />
        : <Skeleton
          circle
          width={125}
          height={125}
        />
      }
      <h5 className="mb-0">
        {!isFetching ?
          <Link to={getRoutePath(routeConsts.PROFILE_CONTRACTOR, { id: contractor.id })}>{contractor.name}</Link>
          : <Skeleton />}
      </h5>
      {contractor ?
        <StarRatings
          rating={contractor.averageEquipmentRating}
        />
        : <Skeleton />
      }
      {contractor ?
        <div>
          <span className="badge badge-pill badge-warning mr-1">{contractor.averageEquipmentRating.toFixed(1)}</span>
          {contractor.equipmentFeedbacksCount} reviews
        </div>
        : <Skeleton />
      }
      <p className="mt-0 text-muted">
        Joined:{" "}
        {contractor ?
          formatDate(contractor.createdTime)
          : (
            <span className="d-inline">
              <Skeleton width={100} />
            </span>
          )}
      </p>
    </div>
  );
};
