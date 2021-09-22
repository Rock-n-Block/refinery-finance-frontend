import React from 'react';
import { observer } from 'mobx-react-lite';

import OpenLinkImg from '@/assets/img/icons/open-link.svg';
import { useMst } from '@/store';
import { feeFormatter, numberWithCommas } from '@/utils';
import { getApy, getRoi } from '@/utils/compoundApy';

import { Modal } from '..';

import './RoiModal.scss';

const mockData = {
  principalAmount: 1000,
};

const periods = [
  {
    numberOfDays: 1,
    timeframe: '1d',
  },
  {
    numberOfDays: 7,
    timeframe: '7d',
  },
  {
    numberOfDays: 30,
    timeframe: '30d',
  },
  {
    numberOfDays: 365,
    timeframe: '365d (APY)',
  },
];

const RoiModal: React.FC = observer(() => {
  const {
    modals,
    pools: {
      fees: { performanceFee },
    },
  } = useMst();

  const { options } = modals.roi;

  const handleClose = () => {
    modals.roi.close();
  };

  // TODO: /trade/swap page must apply for outputCurrency (or other) as a param
  // const apyModalLink = stakingToken.address
  //   ? `/trade/swap?outputCurrency=${getAddress(stakingToken.address)}`
  //   : '/trade/swap';

  if (!options) return null;

  const oneThousandDollarsWorthOfToken = mockData.principalAmount / options.tokenPrice;

  return (
    <Modal isVisible={modals.roi.isOpen} className="m-roi" handleCancel={handleClose} closeIcon>
      <div className="m-roi__content">
        <div className="m-roi__title text-md text-med text-purple text-upper">roi</div>

        {options?.isFarmPage && (
          <div className="text-smd text-purple">
            <div>APR (incl. LP rewards)</div>
            <div>????</div>
            <div>Base APR (yield only)</div>
            <div>{options.apr.toFixed(2)}%</div>
          </div>
        )}
        <div className="m-roi__table">
          <div className="m-roi__table-row text-purple text-bold text-upper">
            <div>timeframe</div>
            <div>roi</div>
            <div>RF PER ${numberWithCommas(mockData.principalAmount)}</div>
          </div>
          {periods.map(({ numberOfDays, timeframe }) => {
            const rf = getApy({
              apr: options.apr,
              days: numberOfDays,
            });
            const roi = getRoi({
              amountEarned: oneThousandDollarsWorthOfToken * rf,
              amountInvested: oneThousandDollarsWorthOfToken,
            }).toFixed(2);
            return (
              <div key={timeframe} className="m-roi__table-row text-smd">
                <div>{timeframe}</div>
                <div>{roi}%</div>
                <div>{rf}</div>
              </div>
            );
          })}
        </div>
        <div className="m-roi__text text-gray text-ssm">
          <p>
            Calculated based on current rates. Compounding 288x daily. Rates are estimates provided
            for your convenience only, and by no means represent guaranteed returns.
          </p>
          <p>
            All estimated rates take into account this pool’s {feeFormatter(performanceFee)}%
            performance fee
          </p>
        </div>
        <a href="/trade/swap" className="m-roi__link box-f-ai-c">
          <div className="text-purple text-smd">Get RP1</div>
          <img src={OpenLinkImg} alt="" />
        </a>
      </div>
    </Modal>
  );
});

export default RoiModal;
