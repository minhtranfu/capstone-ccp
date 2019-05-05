import React, { useState } from 'react';
import Popover from './popover';

let isCanceled = false;

const PopConfirm = ({
  target,
  title,
  message = '',
  onConfirm,
  confirmText = 'Yes',
  confirmColor = 'danger',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const onToggle = e => {
    if (isCanceled) {
      isCanceled = false;
      return;
    }
    if (!e) {
      isCanceled = true;
    }

    setIsOpen(!isOpen);
  };

  return (
    <Popover title={title} isOpen={isOpen} toggle={onToggle} target={target}>
      <p>{message}</p>
      <div className="text-right">
        <button className="btn btn-sm btn-outline-primary" onClick={() => onToggle()}>
          Cancel
        </button>
        <button
          className={`ml-2 btn btn-sm btn-${confirmColor}`}
          onClick={() => {
            onConfirm && onConfirm();
            onToggle();
          }}
        >
          {confirmText}
        </button>
      </div>
    </Popover>
  );
};

export default PopConfirm;
