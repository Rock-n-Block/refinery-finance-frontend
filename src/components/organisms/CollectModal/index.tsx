import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

// import UnknownImg from '@/assets/img/currency/unknown.svg';
import { Button, RadioGroup } from '@/components/atoms';
import { Modal } from '@/components/molecules';
import { PoolsCollectPopover } from '@/components/sections/Pools/Popovers';
import useHarvestPool from '@/hooks/pools/useHarvestPool';
import useStakePool from '@/hooks/pools/useStakePool';
import { useMst } from '@/store';
import { PoolFarmingMode } from '@/types';

import './CollectModal.scss';

// interface IStakeUnstakeModal {
//   isVisible?: boolean;
//   handleClose: () => void;
// }

const compoundHarvestChoices = [
  {
    text: 'Compound',
    value: 1,
  },
  {
    text: 'Harvest',
    value: 0,
  },
];

const ModalTitle: React.FC<{ className?: string; title: string }> = ({ className, title }) => {
  return <div className={classNames(className, 'text-smd text-bold text-purple')}>{title}</div>;
};

const CollectModal: React.FC = observer(() => {
  const {
    modals: { poolsCollect },
  } = useMst();

  const hasCompoundHarvestChoice = poolsCollect.options?.farmMode === PoolFarmingMode.manual;
  const [isCompounding, setCompounding] = useState(Number(hasCompoundHarvestChoice));
  const [pendingTx, setPendingTx] = useState(false);

  useEffect(() => {
    // for any 'location' changes with opened modal
    return () => {
      poolsCollect.close();
    };
  }, [poolsCollect]);

  const { onReward } = useHarvestPool(poolsCollect.options?.poolId || 0);
  const { onStake } = useStakePool(poolsCollect.options?.poolId || 0);

  if (!poolsCollect.options) return null;

  const shouldCompound = hasCompoundHarvestChoice && isCompounding;

  const handleConfirm = async () => {
    if (!poolsCollect.options) return null;
    // compounding
    if (shouldCompound) {
      try {
        setPendingTx(true);
        await onStake(poolsCollect.options.fullBalance, poolsCollect.options.earningTokenDecimals);
        // toastSuccess(
        //   `${t('Compounded')}!`,
        //   t('Your %symbol% earnings have been re-invested into the pool!', {
        //     symbol: earningToken.symbol,
        //   }),
        // );
        poolsCollect.close();
      } catch (e) {
        // toastError(
        //   t('Error'),
        //   t('Please try again. Confirm the transaction and make sure you are paying enough gas!'),
        // );
        console.error(e);
      } finally {
        setPendingTx(false);
      }
    } else {
      // harvesting
      try {
        setPendingTx(true);
        await onReward();
        // toastSuccess(
        //   `${t('Harvested')}!`,
        //   t('Your %symbol% earnings have been sent to your wallet!', {
        //     symbol: earningToken.symbol,
        //   }),
        // );
        poolsCollect.close();
      } catch (e) {
        // toastError(
        //   t('Error'),
        //   t('Please try again. Confirm the transaction and make sure you are paying enough gas!'),
        // );
        console.error(e);
      } finally {
        setPendingTx(false);
      }
    }
    return null;
  };

  const handleCompoundHarvestChoiceChange = (e: any) => {
    const {
      target: { value: option },
    } = e;
    setCompounding(option);
  };

  return (
    <Modal
      isVisible={poolsCollect.isOpen}
      className="pools-collect-modal"
      handleCancel={poolsCollect.close}
      width={330}
      closeIcon
    >
      <div className="pools-collect-modal__content">
        <ModalTitle
          className="pools-collect-modal__title"
          title={`${poolsCollect.options.earningTokenSymbol} ${
            hasCompoundHarvestChoice ? 'Collect' : 'Harvest'
          }`}
        />
        {hasCompoundHarvestChoice && (
          <div className="box-f-c">
            <RadioGroup
              className="pools-collect-modal__radio-group"
              buttonStyle="solid"
              defaultValue={isCompounding}
              items={compoundHarvestChoices}
              onChange={handleCompoundHarvestChoiceChange}
            />
            <PoolsCollectPopover
              className="pools-collect-modal__info"
              symbol={poolsCollect.options.earningTokenSymbol}
            />
          </div>
        )}

        <div className="pools-collect-modal__profit-row box-f box-f-jc-sb">
          <div className="text-smd text-purple">
            {shouldCompound ? 'Compounding' : 'Harvesting'}:
          </div>
          <div className="pools-collect-modal__profit text-smd text-purple text-bold">
            {poolsCollect.options.earnings} {poolsCollect.options.earningTokenSymbol}
          </div>
        </div>
        <Button className="pools-collect-modal__btn" loading={pendingTx} onClick={handleConfirm}>
          <span className="text-white text-bold text-smd">Confirm</span>
        </Button>
      </div>
    </Modal>
  );
});

export default CollectModal;
