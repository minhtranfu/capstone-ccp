import React, { PureComponent } from 'react';

class PageLoader extends PureComponent {
  render() {
    const props = this.props;

    if (props.error) {
      console.log('ERROR LOAD COMPONENT!');
      console.log(props.error);
      return (
        <div className="text-center">
          Error!{' '}
          <button onClick={props.retry} className="btn btn-success">
            Retry
          </button>
        </div>
      );
    }
    
    if (props.timedOut) {
      return (
        <div className="text-center">
          Taking a long time...{' '}
          <button className="btn btn-success" onClick={props.retry}>
            Retry
          </button>
        </div>
      );
    }

    if (props.pastDelay) {
      return (
        <div className="page-loader d-flex flex-column justify-content-center align-items-center">
          <div className="spinner-border" style={{ width: '5rem', height: '5rem' }} role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <h5 className="mt-2">Loading...</h5>
        </div>
      );
    }

    return null;
  }
}

export default PageLoader;
