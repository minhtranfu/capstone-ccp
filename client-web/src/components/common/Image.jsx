import React, { PureComponent } from 'react';
import LazyLoad from 'react-lazyload';
import Skeleton from 'react-loading-skeleton';

class Image extends PureComponent {
  render () {
    const props = this.props;
    return (
      <LazyLoad
        scroll
        throttle={500}
        minHeight="210px"
        placeholder={<Skeleton height={210}/>}
      >
        <img {...props}/>
      </LazyLoad>
    );
  }
}

export default Image;
