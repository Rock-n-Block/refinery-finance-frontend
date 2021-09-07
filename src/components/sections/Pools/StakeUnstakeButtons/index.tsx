import React from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Button } from '@/components/atoms';
import { useMst } from '@/store';

import './StakeUnstakeButtons.scss';

const StakeUnstakeButtons: React.FC<{ className?: string }> = observer(({ className }) => {
  const { modals } = useMst();
  const buttons = [
    {
      handler: () => {
        modals.stakeUnstake.open({
          isStaking: false,
          stakedValue: modals.stakeUnstake.stakedValue,
        });
      },
      text: '-',
    },
    {
      handler: () => {
        modals.stakeUnstake.open({
          isStaking: true,
          stakedValue: modals.stakeUnstake.stakedValue,
        });
      },
      text: '+',
    },
  ];
  return (
    <div className={classNames(className, 'pools-stake-unstake-buttons', 'box-f')}>
      {buttons.map(({ text, handler }) => (
        <Button key={text} colorScheme="outline-purple" size="ssm" onClick={handler}>
          <span className="text-smd text-purple text-bold">{text}</span>
        </Button>
      ))}
    </div>
  );
});

export default StakeUnstakeButtons;
