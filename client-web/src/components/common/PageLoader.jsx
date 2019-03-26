import React, { Component } from 'react';

class PageLoader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true
    };
  }

  render() {
    const props = this.props;

    if (props.error) {
      console.log('ERROR LOAD COMPONENT!');
      console.log(props.error);
      return <div>Error! <button onClick={props.retry} className="btn btn-success">Retry</button></div>;
    } else if (props.timedOut) {
      return <div>Taking a long time... <button className="btn btn-success" onClick={props.retry}>Retry</button></div>;
    }

    return (
      <div className="page-loader d-flex flex-column justify-content-center align-items-center">
        <div className="spinner-border" style={{ width: '5rem', height: '5rem' }} role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <h5 className="mt-2">Loading...</h5>
      </div>
    );

  }
}

export default PageLoader;
