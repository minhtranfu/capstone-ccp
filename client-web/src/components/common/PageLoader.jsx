import React, { PureComponent } from 'react';

class PageLoader extends PureComponent {
  constructor (props) {
    super(props);

    this.state = {
      loading: true
    };
  }

  componentWillUnmount () {

  }

  render () {
    const props = this.props;
    if (props.error) {
      console.log('ERROR LOAD COMPONENT!');
      console.log(props.error);
      return <div>Error! <button onClick={ props.retry } className="btn btn-success">Retry</button></div>;
    } else if (props.timedOut) {
      return <div>Taking a long time... <button onClick={ props.retry }>Retry</button></div>;
    } else if (props.pastDelay) {
      return <div className="page-loader"></div>;
    }
    
    return null;
  }
}

export default PageLoader;
