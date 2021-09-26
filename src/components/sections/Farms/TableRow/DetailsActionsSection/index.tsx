import React, { useMemo } from 'react';
import classNames from 'classnames';

import { Button } from '@/components/atoms';
import { useMst } from '@/store';

import DetailsSectionTitle from '../DetailsSectionTitle';

interface IDetailsActionsSectionProps {
  className?: string;
}

const DetailsActionsSection: React.FC<IDetailsActionsSectionProps> = ({ className }) => {
  const { user } = useMst();

  const hasConnectedWallet = user.address;

  const renderActions = useMemo(() => {
    if (!hasConnectedWallet) {
      return (
        <>
          <DetailsSectionTitle title="Start Farming" />
          <Button size="lg">
            <span className="text-smd text-white text-bold">Unlock Wallet</span>
          </Button>
        </>
      );
    }
    return (
      <>
        <DetailsSectionTitle title="Start Farming" />
        <Button size="lg">
          <span className="text-smd text-white text-bold">Enable</span>
        </Button>
      </>
    );
  }, [hasConnectedWallet]);

  return (
    <div className={classNames(className, 'farms-table-row__details-box')}>{renderActions}</div>
  );
};

export default DetailsActionsSection;
