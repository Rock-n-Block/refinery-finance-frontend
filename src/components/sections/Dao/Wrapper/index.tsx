import React from 'react';
import classNames from 'classnames';

import './Wrapper.scss';

interface IWrapperProps {
  className?: string;
}

const Wrapper: React.FC<IWrapperProps> = ({ className, children }) => {
  return (
    <main className="dao-wrapper">
      <div className="row">
        <div className={classNames(className, 'dao-wrapper__content box-purple-l')}>{children}</div>
      </div>
    </main>
  );
};

export default Wrapper;
