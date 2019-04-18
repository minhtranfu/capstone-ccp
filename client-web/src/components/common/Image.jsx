import React, { PureComponent } from 'react';
import LazyLoad from 'react-lazyload';
import Skeleton from 'react-loading-skeleton';

class Image extends PureComponent {
  defaultSrc = 'https://via.placeholder.com/230x140';
  state = {
    isLoadError: false,
  };

  // Set to default image src on image
  _handleLoadImageError = () => {
    this.setState({
      isLoadError: true,
    });
  };

  render () {
    const {circle, width, height, ...props} = this.props;
    const { isLoadError } = this.state;

    // Check if image load error
    if (isLoadError) {
      props.src = this.defaultSrc;
    }

    return (
      <LazyLoad
        scroll
        throttle={500}
        height={height}
        placeholder={<Skeleton height={height} width={width} circle={circle}/>}
      >
        <img {...props} height={height} width={width} onError={this._handleLoadImageError}/>
      </LazyLoad>
    );
  }
}

export default Image;
