import React, { useState } from 'react';
import BigNumber from 'bignumber.js/bignumber';
import { observer } from 'mobx-react-lite';

import BgImg from '@/assets/img/sections/pools/bg-2.svg';
import { Button } from '@/components/atoms';
import { errorNotification, successNotification } from '@/components/atoms/Notification';
import { useRefineryUsdPrice } from '@/hooks/useTokenUsdPrice';
import { useWalletConnectorContext } from '@/services/MetamaskConnect';
import { getContract } from '@/services/web3/contractHelpers';
import { useCallWithGasPrice } from '@/services/web3/hooks';
import { useMst } from '@/store';
import { useSelectVaultData } from '@/store/pools/hooks';
import { IReceipt, Precisions } from '@/types';
import { getFullDisplayBalance } from '@/utils/formatters';

// import { loadingDataFormatter } from '@/utils';
import { AutoBountyPopover } from '../Popovers';

import './Preview.scss';

const mockData = {
  symbol: 'RP1',
};

const ClaimBounty: React.FC = observer(() => {
  const [pendingTx, setPendingTx] = useState(false);
  const { tokenUsdPrice } = useRefineryUsdPrice();
  const { user } = useMst();
  const { connect } = useWalletConnectorContext();
  const { callWithGasPrice } = useCallWithGasPrice();

  const handleClaimBounty = async () => {
    setPendingTx(true);
    try {
      const contract = getContract('REFINERY_VAULT');
      const tx = await callWithGasPrice({
        contract,
        methodName: 'harvest',
        options: {
          gas: 300000,
        },
      });
      if ((tx as IReceipt).status) {
        successNotification(
          'Bounty collected!',
          `${mockData.symbol} bounty has been sent to your wallet.`,
        );
      }
    } catch (error: any) {
      console.error(error);
      errorNotification(
        'Error',
        'Please try again. Confirm the transaction and make sure you are paying enough gas!',
      );
    } finally {
      setPendingTx(false);
    }
  };

  const { fees, estimatedRefineryBountyReward } = useSelectVaultData();

  const displayBountyReward =
    estimatedRefineryBountyReward === null
      ? '###'
      : getFullDisplayBalance({
          balance: estimatedRefineryBountyReward,
          displayDecimals: Precisions.shortToken,
        });

  const displayBountyRewardUsd =
    estimatedRefineryBountyReward === null
      ? '###'
      : getFullDisplayBalance({
          balance: new BigNumber(estimatedRefineryBountyReward).multipliedBy(tokenUsdPrice),
          displayDecimals: Precisions.fiat,
        });

  return (
    <div className="pools-preview__bounty box-white box-shadow">
      <div className="pools-preview__bounty-title box-f-ai-c">
        <span className="text-upper text-med text-ssm text-purple">
          Auto {mockData.symbol} Bounty
        </span>
        <AutoBountyPopover symbol={mockData.symbol} fee={fees.callFee} />
      </div>
      <div className="pools-preview__bounty-box box-f-ai-c box-f-jc-sb">
        <div>
          <div className="text-lg">{displayBountyReward}</div>
          <div className="pools-preview__bounty-usd text-med text-gray">
            ~ {displayBountyRewardUsd} USD
          </div>
        </div>
        {!user.address ? (
          <Button className="pools-preview__bounty-btn" onClick={connect}>
            <span className="text-white text-smd text-bold">Connect Wallet</span>
          </Button>
        ) : (
          <Button
            className="pools-preview__bounty-btn"
            loading={pendingTx}
            disabled={!estimatedRefineryBountyReward?.toNumber()}
            onClick={estimatedRefineryBountyReward?.toNumber() ? handleClaimBounty : undefined}
          >
            <span className="text-white text-smd text-bold">Claim</span>
          </Button>
        )}
      </div>
    </div>
  );
});

const Preview: React.FC = observer(() => {
  return (
    <div className="pools-preview box-f-ai-c box-f-jc-sb">
      <img src={BgImg} alt="" className="pools-preview__bg" />
      <div className="pools-preview__box">
        <h1 className="pools-preview__title h1-lg text-white text-bold">Rocket Pools</h1>
        <div className="pools-preview__subtitle text-white">
          Simply stake tokens to earn. <br />
          High APR, low risk.
        </div>
      </div>
      <ClaimBounty />
    </div>
  );
});

export default Preview;
