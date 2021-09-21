import React, { useState } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Button } from '@/components/atoms';
import { ButtonProps } from '@/components/atoms/Button';
import { useWalletConnectorContext } from '@/services/MetamaskConnect';
import { useMst } from '@/store';

const StakingSection: React.FC<{
  titleClassName?: string;
  tokenSymbol: string;
  buttonProps: Omit<ButtonProps, 'onClick'>;
}> = observer(({ titleClassName, tokenSymbol, buttonProps }) => {
  const { connect } = useWalletConnectorContext();
  const { user, modals } = useMst();
  // TODO: specify the 'staked' property to indicate isStaked some coins
  const [MOCK_isStakingEnabled, MOCK_setStakingEnabled] = useState(false);
  const hasConnectedWallet = Boolean(user.address);
  const isStakingEnabled = MOCK_isStakingEnabled;
  const types = [
    {
      condition: !hasConnectedWallet,
      title: 'Start Earning',
      handler: connect,
      text: 'Unlock Wallet',
    },
    {
      condition: hasConnectedWallet && !isStakingEnabled,
      title: 'Start Staking',
      handler: () => MOCK_setStakingEnabled(true),
      text: 'Enable',
    },
    {
      condition: hasConnectedWallet && isStakingEnabled && !modals.stakeUnstake.stakedValue,
      title: `Stake ${tokenSymbol}`,
      handler: () => {
        modals.stakeUnstake.open({ isStaking: true, stakedValue: modals.stakeUnstake.stakedValue });
        // TODO: remove this MOCK functionality
        const myResult = modals.stakeUnstake.result;
        console.log('Staking Section', myResult);
      },
      text: 'Stake',
    },
  ];

  const template = types.find(({ condition }) => condition);

  if (template) {
    const { title, handler, text } = template;
    return (
      <>
        <div className={classNames(titleClassName, 'text-purple text-med')}>{title}</div>
        <Button {...buttonProps} onClick={handler}>
          <span className="text-smd text-white text-bold">{text}</span>
        </Button>
      </>
    );
  }

  return null;
});

export default StakingSection;
