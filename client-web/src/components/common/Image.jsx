import React, { PureComponent } from 'react';
import LazyLoad from 'react-lazyload';
import Skeleton from 'react-loading-skeleton';

class Image extends PureComponent {
  render () {
    const {circle, width, height, ...props} = this.props;
    return (
      <LazyLoad
        scroll
        throttle={500}
        height={height}
        placeholder={<Skeleton height={height} width={width} circle={circle}/>}
      >
        <img {...props} height={height} width={width}/>
      </LazyLoad>
    );
  }
}

export default Image;
