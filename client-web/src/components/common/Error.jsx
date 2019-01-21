import PropTypes from 'prop-types';
import React from 'react';

/**
 * Contrived Error component used *ONLY* for testing purposes
 * (see /test/components/common/test-error.js)
 * @param message
 * @constructor
 */
export default function Error ({ message }) {
  return (
    <span
      id={'foo-id'} // IRL, pass this in via props, or auto-generate
      className="text-error">
      {message || 'No detail provided'}
    </span>
  );
}

Error.propTypes = {
  message: PropTypes.string.isRequired
};
