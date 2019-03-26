import React from 'react';

export const ComponentBlocking = () => {
  return (
    <div className="component-blocking">
      <div className="spinner-border text-primary" role="status">
        <span className="sr-only">Proccessing...</span>
      </div>
      <h5 className="text-light">Proccessing...</h5>
    </div>
  );
};

export default ComponentBlocking
