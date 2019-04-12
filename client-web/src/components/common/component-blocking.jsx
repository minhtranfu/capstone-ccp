import React from 'react';
import PropTypes from 'prop-types';

export const ComponentBlocking = ({ message }) => {

  return (
    <div className="component-blocking">
      <div className="spinner-border text-primary" role="status">
        <span className="sr-only">{message}</span>
      </div>
      <h5 className="text-light">{message}</h5>
    </div>
  );
};

ComponentBlocking.props = {
  message: PropTypes.string
};

ComponentBlocking.defaultProps = {
  message: 'Proccessing...'
};

export default ComponentBlocking
