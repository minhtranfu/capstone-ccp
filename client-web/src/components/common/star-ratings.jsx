import React from 'react';
import ReactStarRatings from 'react-star-ratings';

export const StarRatings = ({
  rating = 0,
  numberOfStars = 5,
  starRatedColor = "#ffac00",
  starDimension = "20px",
  starSpacing = "0px",
}) => {
  return (
    <ReactStarRatings
      rating={rating}
      numberOfStars={numberOfStars}
      starRatedColor={starRatedColor}
      starDimension={starDimension}
      starSpacing={starSpacing}
      />
  );
};

export default StarRatings;
