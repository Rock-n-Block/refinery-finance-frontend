import React, { useEffect, useMemo, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import ArrowPurple from '@/assets/img/icons/arrow-btn.svg';
import { Button, InputNumber } from '@/components/atoms';
import FarmingModeStatus from '@/components/sections/Pools/FarmingModeStatus';
import OpenLink from '@/components/sections/Pools/OpenLink';
// import { IPoolCard } from '@/components/sections/Pools/PoolCard';
import { AutoFarmingPopover, ManualFarmingPopover } from '@/components/sections/Pools/Popovers';
import {
  AprColumn,
  EndsInColumn,
  RecentProfitColumn,
  TotalStakedColumn,
} from '@/components/sections/Pools/TableRow/Columns';
import { useMst } from '@/store';
import { IPoolFarmingMode, Pool, PoolFarmingMode, Token } from '@/types';

import CollectButton from '../CollectButton';
import StakeUnstakeButtons from '../StakeUnstakeButtons';
import StakingSection from '../StakingSection';

import './TableRow.scss';

interface ITableRowProps {
  farmMode: IPoolFarmingMode;
  data: Pool;
  columns: any[];
}

interface IRecentProfitProps {
  farmMode: IPoolFarmingMode;
  tokenStake: Token;
  value: number;
  onCollect: () => void;
}

const mockData = {
  totalStaked: '1,662,947,888',
  totalBlocks: '1,663,423',
  currencyToConvert: 'USD',
};

const links = [
  {
    href: '/',
    text: 'See Token Info',
  },
  {
    href: '/',
    text: 'View Project Site',
  },
  {
    href: '/',
    text: 'View Contract',
  },
];
// const links = [
//   {
//     href: `/token/${earningToken.address ? getAddress(earningToken.address) : ''}`,
//     text: 'See Token Info',
//   },
//   {
//     href: earningToken.projectLink,
//     text: 'View Project Site',
//   },
//   {
//     href: `https://bscscan.com/address/${
//       type === PoolFarmingMode.auto
//         ? getContractAddress('REFINERY_VAULT')
//         : getAddress(pool.contractAddress)
//     }`,
//     text: 'View Contract',
//   },
// ];

const DetailsLinks: React.FC<{ farmMode: IPoolFarmingMode }> = ({ farmMode }) => {
  return (
    <div className="pools-table-row__details-links">
      {links.map(({ href, text }) => (
        <OpenLink
          key={href + text}
          className="pools-table-row__details-links-item"
          href={href}
          text={text}
        />
      ))}
      <div className="box-f-c">
        <FarmingModeStatus type={farmMode} />
        {farmMode === PoolFarmingMode.auto ? (
          <AutoFarmingPopover className="pools-table-row__details-info-popover" />
        ) : (
          <ManualFarmingPopover className="pools-table-row__details-info-popover" />
        )}
      </div>
    </div>
  );
};

const RecentProfit: React.FC<IRecentProfitProps> = ({ farmMode, tokenStake, value, onCollect }) => {
  return (
    <div className="pools-table-row__details-box">
      <div className="pools-table-row__details-title text-purple text-ssm text-med text-upper">
        recent {tokenStake.symbol} profit
      </div>
      <InputNumber
        colorScheme="white"
        value={value}
        inputPrefix={<CollectButton farmMode={farmMode} value={value} collectHandler={onCollect} />}
        readOnly
      />
    </div>
  );
};

const TableRow: React.FC<ITableRowProps> = observer(({ farmMode, data, columns }) => {
  const { user, modals } = useMst();
  const [isOpenDetails, setOpenDetails] = useState(false);
  const [MOCK_recentProfit, MOCK_setRecentProfit] = useState(0);
  const { earningToken } = data;

  const handleChangeDetails = (value: boolean): void => {
    setOpenDetails(value);
  };

  const handleToggleDetails = (): void => {
    setOpenDetails((isOpen) => !isOpen);
  };

  const handleOpenRoiModal = (e: React.MouseEvent | React.KeyboardEvent): void => {
    e.stopPropagation();
    // TODO: POOLS TABLE ROW MODAL
    modals.roi.open({
      isFarmPage: false,
      apr: 5,
      tokenPrice: 1,
    });
  };

  const collectHandler = () => {
    MOCK_setRecentProfit(0);
  };

  const { stakingToken, apr } = data;
  const hasConnectedWallet = Boolean(user.address);
  const hasStakedValue = Boolean(modals.stakeUnstake.stakedValue);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      MOCK_setRecentProfit(0.0003);
    }, 2000);
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);
  const USD_IN_TOKEN = 27;
  // useEffect(() => {
  //   const
  //   MOCK_setConvertedRecentProfit(MOCK_recentProfit * USD_IN_TOKEN);
  // }, [MOCK_recentProfit]);

  const MOCK_convertedRecentProfit = useMemo(() => {
    return MOCK_recentProfit * USD_IN_TOKEN;
  }, [MOCK_recentProfit]);

  const MOCK_convertedStakedValue = useMemo(() => {
    return modals.stakeUnstake.stakedValue * USD_IN_TOKEN;
  }, [modals.stakeUnstake.stakedValue]);

  return (
    <div className="pools-table-row">
      <div
        className="pools-table-row__content"
        onClick={handleToggleDetails}
        onKeyDown={handleToggleDetails}
        role="button"
        tabIndex={0}
      >
        <div className="pools-table-row__currencies box-f-ai-c t-box-b">
          <div className="box pools-table-row__currencies-item">
            <img
              src={earningToken.logoURI}
              alt="currency"
              className="pools-table-row__currencies-item-image"
            />
          </div>
          <div className="box">
            <div className="text-smd">
              <span className="text-capitalize">{farmMode}</span>{' '}
              <span className="text-upper">{stakingToken.symbol}</span>
            </div>
            <div className="text-ssm text-gray-l-2">
              <span className="text-capitalize">stake</span>{' '}
              <span className="text-upper">{stakingToken.symbol}</span>
            </div>
          </div>
        </div>
        <RecentProfitColumn
          name={columns[0].name}
          value={MOCK_recentProfit}
          usdValue={MOCK_convertedRecentProfit}
        />
        <AprColumn name={columns[1].name} value={Number(apr)} modalHandler={handleOpenRoiModal} />
        <TotalStakedColumn value={mockData.totalStaked} onlyDesktop />
        <EndsInColumn value={mockData.totalBlocks} onlyDesktop />
        <div className="pools-table-row__item box-f-jc-e box-f">
          <div
            className={classNames('pools-table-row__item--mob t-box-b', {
              'pools-table-row__item--mob_active': isOpenDetails,
            })}
          >
            <img src={ArrowPurple} alt="arrow" />
          </div>
          <div className="pools-table-row__item--pc t-box-none">
            <Button
              colorScheme="outline-purple"
              size="smd"
              arrow
              toggle
              isActive={isOpenDetails}
              onToggle={handleChangeDetails}
            >
              <span>Details</span>
            </Button>
          </div>
        </div>
      </div>
      <CSSTransition
        unmountOnExit
        mountOnEnter
        in={isOpenDetails}
        addEndListener={(node, done) => {
          node.addEventListener('transitionend', done, false);
        }}
        classNames="show"
      >
        <div className="pools-table-row__details box-purple-l">
          <DetailsLinks farmMode={farmMode} />
          <div className="pools-table-row__buttons box-f-ai-c t-box-b">
            <RecentProfit
              farmMode={farmMode}
              tokenStake={stakingToken}
              value={MOCK_recentProfit}
              onCollect={collectHandler}
            />
            <div className="pools-table-row__details-box">
              {hasConnectedWallet && hasStakedValue ? (
                <>
                  <div className="pools-table-row__details-title text-ssm text-upper text-purple text-med">
                    {stakingToken.symbol} Staked{' '}
                    {farmMode === PoolFarmingMode.auto && '(compounding)'}
                  </div>
                  <div className="box-f box-f-jc-sb box-f-ai-e">
                    <div className="pools-table-row__details-staked-values-group">
                      <div className="pools-table-row__details-staked-value text-blue-d text-smd">
                        {modals.stakeUnstake.stakedValue}
                      </div>
                      <div className="text-gray text-smd">
                        ~{MOCK_convertedStakedValue} {mockData.currencyToConvert}
                      </div>
                    </div>
                    <StakeUnstakeButtons />
                  </div>
                </>
              ) : (
                <StakingSection
                  pool={data}
                  titleClassName="pools-table-row__details-title text-ssm text-upper"
                  buttonProps={{
                    className: 'pools-table-row__details-box-start-staking-button',
                    size: 'lg',
                  }}
                  tokenSymbol={stakingToken.symbol}
                />
              )}
            </div>
          </div>
        </div>
      </CSSTransition>
    </div>
  );
});

export default TableRow;
