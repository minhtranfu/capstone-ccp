import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';

import { Image, StarRatings } from 'Components/common';
import { getRoutePath } from 'Utils/common.utils';
import { routeConsts } from 'Common/consts';
import { formatDate } from 'Utils/format.utils';

const ratingTypeKeys = {
  equipment: 'averageEquipmentRating',
  material: 'averageMaterialRating',
  debris: 'averageDebrisRating',
};

const ContractorCard = ({
  contractor,
  ratingType = 'equipment',
  avatarWith = 125,
  avatarHeight = 125,
}) => {
  const ratingKey = ratingTypeKeys[ratingType];
  const feedbackCountKey = `${ratingType}FeedbacksCount`;

  return (
    <div className="constructor-card text-center">
      {contractor && contractor.thumbnailImageUrl ? (
        <Image
          circle
          src={contractor.thumbnailImageUrl}
          width={avatarWith}
          height={avatarHeight}
          className="rounded-circle"
          alt={`${contractor.name}'s avatar`}
        />
      ) : (
        <Skeleton circle width={avatarWith} height={avatarHeight} />
      )}
      <h5 className="mb-0">
        {contractor ? (
          <Link to={getRoutePath(routeConsts.PROFILE_CONTRACTOR, { id: contractor.id })}>
            {contractor.name}
          </Link>
        ) : (
          <Skeleton />
        )}
      </h5>
      {contractor ? <StarRatings rating={contractor[ratingKey]} /> : <Skeleton />}
      {contractor ? (
        <div>
          <span className="badge badge-pill badge-warning mr-1">
            {contractor[ratingKey].toFixed(1)}
          </span>
          {contractor[feedbackCountKey]} reviews
        </div>
      ) : (
        <Skeleton />
      )}
      <div className="mt-1">
        <a className="text-muted" href={`tel:${contractor.phoneNumber}`}>
          <i className="fal fa-phone" /> {contractor.phoneNumber}
        </a>
      </div>
      <p className="mt-0 text-muted">
        Joined:{' '}
        {contractor ? (
          formatDate(contractor.createdTime)
        ) : (
          <span className="d-inline">
            <Skeleton width={100} />
          </span>
        )}
      </p>
    </div>
  );
};

export default ContractorCard;
