import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Page = forwardRef(({ title, children, ...rest }, ref) => {
  return (
    <div ref={ref} {...rest}>
      <React.Fragment>
        <title>{title}</title>
      </React.Fragment>
      {children}
    </div>
  );
});

Page.displayName = 'Page'; // Set the displayName explicitly

Page.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string
};

export default Page;
