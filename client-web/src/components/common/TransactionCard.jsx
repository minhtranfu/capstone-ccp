import React, { Component } from 'react';
import PropTypes from 'prop-types';

class TransactionCard extends Component {
  render() {
    return (
      <div>TransactionCard</div>
    );
  }
}

TransactionCard.props = {
  transaction: PropTypes.object.isRequired,
  buttons: PropTypes.array
};

export default TransactionCard;