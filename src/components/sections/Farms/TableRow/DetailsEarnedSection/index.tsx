import React from 'react';
import classNames from 'classnames';

import { Button, InputNumber } from '@/components/atoms';

import DetailsSectionTitle from '../DetailsSectionTitle';
import { EARNING_TOKEN_SYMBOL } from '../utils';

interface IDetailsEarnedSectionProps {
  className?: string;
}

const DetailsEarnedSection: React.FC<IDetailsEarnedSectionProps> = ({ className }) => {
  return (
    <div className={classNames(className, 'farms-table-row__details-box')}>
      <DetailsSectionTitle title={`${EARNING_TOKEN_SYMBOL} Earned`} />
      <InputNumber
        colorScheme="white"
        placeholder="0.0"
        inputPrefix={
          <Button colorScheme="purple" size="ssm">
            <span className="text-white text-ssmd text-med">Harvest</span>
          </Button>
        }
        readOnly
      />
    </div>
  );
};

export default DetailsEarnedSection;
