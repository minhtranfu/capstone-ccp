import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';

class NotFound extends PureComponent {
  render () {
    return (
      <div className="container my-auto text-center">
        <h1 className="text-center mb-5">Whoops, page not found!</h1>
        <Link to='/' className="btn btn-primary btn-lg"><i className="fal fa-home"></i> Back to home</Link>
      </div>
    );
  }
}

export default NotFound;
