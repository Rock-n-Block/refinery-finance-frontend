import React, { useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import BnbImg from '@/assets/img/currency/bnb.svg';
import ArrowPurple from '@/assets/img/icons/arrow-btn.svg';
import InfoImg from '@/assets/img/icons/info.svg';
import { ReactComponent as RefreshAutoIcon } from '@/assets/img/icons/refresh-auto.svg';
import RefreshImg from '@/assets/img/icons/refresh.svg';
import { Button, InputNumber, Popover } from '@/components/atoms';
import OpenLink from '@/components/sections/Pools/OpenLink';
import { IPoolCard } from '@/components/sections/Pools/PoolCard';
import DropdownSelector from '@/components/sections/Pools/PoolCard/DropdownSelector';
import {
  AprColumn,
  EndsInColumn,
  RecentProfitColumn,
  TotalStakedColumn,
} from '@/components/sections/Pools/TableRow/Columns';
import { useMst } from '@/store';

import './TableRow.scss';

interface ITableRowProps {
  data: IPoolCard;
  columns: any[];
}

const mockData = {
  recentProfit: 0,
  recentProfitUsd: 0,
  totalStaked: '1,662,947,888',
  totalBlocks: '1,663,423',
};

const TableRow: React.FC<ITableRowProps> = ({ data, columns }) => {
  const { user, modals } = useMst();
  const [isOpenDetails, setOpenDetails] = React.useState<boolean>(false);

  const handleChangeDetails = (value: boolean): void => {
    setOpenDetails(value);
  };

  const handleToggleDetails = (): void => {
    setOpenDetails((isOpen) => !isOpen);
  };

  const handleOpenRoiModal = (e: React.MouseEvent | React.KeyboardEvent): void => {
    e.stopPropagation();
    modals.roi.open([
      {
        timeframe: '1D',
        roi: 0.19,
        rf: 0.12,
      },
      {
        timeframe: '7D',
        roi: 1.43,
        rf: 0.88,
      },
    ]);
  };

  const { tokenStake, apr, type } = data;

  const [isChooseFarmModeOpen, setChooseFarmModeOpen] = useState(false);
  const [farmMode, setFarmMode] = useState<typeof type>('manual');

  const farmModes = ['Auto', 'Manual'];

  const handleOpenChooseFarmMode = () => setChooseFarmModeOpen(true);
  const handleCloseChooseFarmMode = () => setChooseFarmModeOpen(false);

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
            <img src={BnbImg} alt="currency" className="pools-table-row__currencies-item-image" />
          </div>
          <div className="box">
            <div className="text-smd">
              <span className="text-capitalize">{data.type}</span>{' '}
              <span className="text-upper">{tokenStake.symbol}</span>
            </div>
            <div className="text-ssm text-gray-l-2">
              <span className="text-capitalize">stake</span>{' '}
              <span className="text-upper">{tokenStake.symbol}</span>
            </div>
          </div>
        </div>
        <RecentProfitColumn
          name={columns[0].name}
          value={mockData.recentProfit}
          usdValue={mockData.recentProfitUsd}
        />
        <AprColumn name={columns[1].name} value={apr.value} modalHandler={handleOpenRoiModal} />
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
          <div className="pools-table-row__details-links">
            <PoolOpenLink
              className="pools-table-row__details-links-item"
              href="/"
              text="See Token Info"
            />
            <PoolOpenLink
              className="pools-table-row__details-links-item"
              href="/"
              text="View Project Site"
            />
            <PoolOpenLink
              className="pools-table-row__details-links-item"
              href="/"
              text="View Contract"
            />
            <div className="box-f-c">
              <DropdownSelector
                className="pools-table-row__details-dropdown"
                items={farmModes}
                open={isChooseFarmModeOpen}
                defaultValue={farmModes[1]}
                onChange={(value) => {
                  setFarmMode((value as string).toLowerCase() as typeof type);
                }}
                onDropdownVisibleChange={handleCloseChooseFarmMode}
              >
                {farmMode === 'auto' && (
                  <Button
                    className={classNames(
                      'pools-table-row__details-dropdown-button-with-icon',
                      'pools-table-row__details-dropdown-button-with-icon_auto',
                    )}
                    size="smd"
                    colorScheme="outline-green"
                    arrow
                    onClick={handleOpenChooseFarmMode}
                  >
                    <div className="box-f-c">
                      <RefreshAutoIcon />
                    </div>
                    <span className="pools-table-row__details-dropdown-button-text text text-med text-green">
                      {farmModes[0]}
                    </span>
                  </Button>
                )}
                {farmMode === 'manual' && (
                  <Button
                    className={classNames('pools-table-row__details-dropdown-button-with-icon')}
                    size="smd"
                    colorScheme="outline-purple"
                    arrow
                    onClick={handleOpenChooseFarmMode}
                  >
                    <img src={RefreshImg} alt="" />
                    <span className="pools-table-row__details-dropdown-button-text text text-med text-purple">
                      {farmModes[1]}
                    </span>
                  </Button>
                )}
              </DropdownSelector>
              <Popover
                className="pools-table-row__details-info-popover"
                content={
                  <span className="text-med text text-purple">
                    Total amount of {tokenStake.symbol} staked in this pool
                  </span>
                }
                overlayInnerStyle={{ borderRadius: '20px' }}
              >
                <img src={InfoImg} alt="" />
              </Popover>
            </div>
          </div>
          <div className="pools-table-row__buttons box-f-ai-c t-box-b">
            <div className="pools-table-row__details-box">
              <div className="pools-table-row__details-title text-purple text-ssm text-med text-upper">
                recent {tokenStake.symbol} profit
              </div>
              <InputNumber
                colorScheme="white"
                placeholder="0.0"
                inputPrefix={
                  <Button colorScheme="purple" size="ssm">
                    <span className="text-white text-ssmd text-med">Collect</span>
                  </Button>
                }
              />
            </div>
            <div className="pools-table-row__details-box">
              <div className="pools-table-row__details-title text-purple text-ssm text-med text-upper">
                start staking
              </div>
              <Button size="lg" onClick={user.address ? () => {} : () => {}}>
                <span className="text-smd text-white text-bold">
                  {user.address ? 'Enable' : 'Unlock Wallet'}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </CSSTransition>
    </div>
  );
};

export default observer(TableRow);
