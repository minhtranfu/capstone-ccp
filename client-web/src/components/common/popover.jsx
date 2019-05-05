import React from 'react';
import { UncontrolledPopover, PopoverHeader, PopoverBody } from 'reactstrap';

const Popover = ({ title, children, target, ...popProps }) => {
  return (
    <UncontrolledPopover
      trigger="legacy"
      placement="auto"
      delay={0}
      target={target}
      {...popProps}
    >
      <PopoverHeader>{title}</PopoverHeader>
      <PopoverBody>{children}</PopoverBody>
    </UncontrolledPopover>
  );
};

export default Popover;
