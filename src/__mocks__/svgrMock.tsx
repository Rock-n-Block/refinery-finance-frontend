import React from 'react';

const SvgrMock = React.forwardRef((props, ref) => (
  // @ts-ignore
  <span ref={ref} {...props} />
));

export const ReactComponent = SvgrMock;
export default SvgrMock;
