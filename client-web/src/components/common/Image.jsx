import React, { PureComponent } from 'react';
import LazyLoad from 'react-lazyload';
import Skeleton from 'react-loading-skeleton';

class Image extends PureComponent {
  render () {
    const {circle, ...props} = this.props;
    return (
      <LazyLoad
        scroll
        throttle={500}
        minHeight="210px"
        placeholder={<Skeleton height={210} circle={circle}/>}
      >
        <img {...props}/>
      </LazyLoad>
    );
  }
}

export default Image;
