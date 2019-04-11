import React, { PureComponent } from 'react';
import { CSSTransition } from 'react-transition-group';
import PropTypes from 'prop-types';

class MaterialFeedbacks extends PureComponent {

  state = {
    isShow: false,
  };

  componentDidMount() {
    this.setState({
      isShow: true
    });
  }

  render() {
    const { isShow } = this.state;
    return (
      <CSSTransition
        in={isShow}
        timeout={500}
        classNames="fade"
      >
        <div>
          <strong>Material Feedbacks</strong>
          <p>With supporting text below as a natural lead-in to additional content. With supporting text below as a natural lead-in to additional content.</p>
        </div>
      </CSSTransition>
    );
  }
}

MaterialFeedbacks.props = {
  contractorId: PropTypes.number.isRequired
};

export default MaterialFeedbacks;
