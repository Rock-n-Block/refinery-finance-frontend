/* eslint-disable react/react-in-jsx-scope */
import { FC } from 'react';

import { IstepsDataConfig } from '@/types';

import './StepCard.scss';

const StepCard: FC<IstepsDataConfig> = ({
  id,
  mainTitle,
  mainSubtitle,
  secondTitle,
  secondSubtitle,
  children,
}) => {
  return (
    <div className="stepCard-wrapper">
      <span className="stepCard__num text-orange">STEP {id}</span>
      <div className="stepCard__title">{mainTitle}</div>
      <div className="stepCard__subtitle">{mainSubtitle}</div>
      <div className="stepCard-body">
        <div className="stepCard-body__title">{secondTitle}</div>
        <div className="stepCard-body__subtitle">{secondSubtitle}</div>
        {children}
      </div>
    </div>
  );
};

export default StepCard;
