import React from 'react';
import BigNumber from 'bignumber.js/bignumber';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Button } from '@/components/atoms';
import { ButtonProps } from '@/components/atoms/Button';
import {
  useApprovePool,
  useCheckVaultApprovalStatus,
  useVaultApprove,
} from '@/hooks/pools/useApprove';
import { useWalletConnectorContext } from '@/services/MetamaskConnect';
import { getAddress, getContractData } from '@/services/web3/contractHelpers';
import { useMst } from '@/store';
import { Pool } from '@/types';
import { BIG_ZERO } from '@/utils';

const StakingSection: React.FC<{
  pool: Pool;
  titleClassName?: string;
  tokenSymbol: string;
  buttonProps: Omit<ButtonProps, 'onClick'>;
}> = observer(({ pool, titleClassName, tokenSymbol, buttonProps }) => {
  const { connect, metamaskService } = useWalletConnectorContext();
  const { user, modals } = useMst();
  const { isAutoVault = false, userData, id, stakingToken } = pool;

  // Data for regular approval buttons
  const allowance = userData?.allowance ? new BigNumber(userData.allowance) : BIG_ZERO;
  const needsApproval = !allowance.gt(0);

  // Data for AUTO_VAULT approval buttons
  const { isVaultApproved, setLastUpdated } = useCheckVaultApprovalStatus();

  let handleApprove;
  let requestedApproval;
  if (isAutoVault) {
    const autoVaultApprove = useVaultApprove(setLastUpdated);
    handleApprove = autoVaultApprove.handleApprove;
    requestedApproval = autoVaultApprove.requestedApproval;
  } else {
    const [, erc20Abi] = getContractData('ERC20');
    const stakingTokenContract = metamaskService.getContract(
      getAddress(stakingToken.address),
      erc20Abi,
    );
    const poolApprove = useApprovePool(stakingTokenContract, id);
    handleApprove = poolApprove.handleApprove;
    requestedApproval = poolApprove.requestedApproval;
  }

  // TODO: specify the 'staked' property to indicate isStaked some coins
  // const [MOCK_isStakingEnabled, MOCK_setStakingEnabled] = useState(false);
  const hasConnectedWallet = Boolean(user.address);
  // const isStakingEnabled = MOCK_isStakingEnabled;
  const types = [
    {
      condition: !hasConnectedWallet,
      title: 'Start Earning',
      handler: connect,
      text: 'Unlock Wallet',
    },
    {
      condition: hasConnectedWallet && isAutoVault && !isVaultApproved,
      title: 'Start Staking',
      handler: handleApprove,
      text: 'Enable',
      extraButtonProps: {
        disabled: requestedApproval,
      },
    },
    {
      condition: hasConnectedWallet && !isAutoVault && needsApproval,
      title: 'Start Staking',
      handler: handleApprove,
      text: 'Enable',
    },
    {
      // TODO: change condition to correct use needsApproval
      condition:
        hasConnectedWallet &&
        (!needsApproval || isVaultApproved) &&
        !modals.stakeUnstake.stakedValue,
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
    const { title, handler, text, extraButtonProps } = template;
    return (
      <>
        <div className={classNames(titleClassName, 'text-purple text-med')}>{title}</div>
        <Button {...buttonProps} {...extraButtonProps} onClick={handler}>
          <span className="text-smd text-white text-bold">{text}</span>
        </Button>
      </>
    );
  }

  return null;
});

export default StakingSection;
