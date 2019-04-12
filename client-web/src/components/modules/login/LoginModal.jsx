import React from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

import LoginForm from './LoginForm';

const LoginModal = ({ isOpen, className, onClose }) => {

  return (
    <Modal isOpen={isOpen} toggle={onClose} className={className} size="lg">
      <ModalHeader toggle={onClose}>Login</ModalHeader>
      <ModalBody>
        <LoginForm />
      </ModalBody>
    </Modal>
  );
};

LoginModal.props = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func
};

export default LoginModal;
