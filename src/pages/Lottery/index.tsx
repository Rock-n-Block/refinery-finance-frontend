import React from 'react';
import { useParams, useHistory } from 'react-router-dom';

import {
  LotteryPreview,
  LotteryNotFound,
  LotteryRound,
  WinningTicketsModal,
  BuyTicketsModal,
} from '../../components/sections/Lottery';
import { Search, Button } from '../../components/atoms';

import './Lottery.scss';

interface ILotteryId {
  id: string;
}

const Lottery: React.FC = () => {
  const history = useHistory();
  const { id } = useParams<ILotteryId>();
  console.log(id);

  const [isWinningTicketsModalVisible, setWinningTicketsModalVisible] = React.useState<boolean>(
    false,
  );

  const [isBuyTicketsModalVisible, setBuyTicketsModalVisible] = React.useState<boolean>(false);

  const handleSearch = (value: number | string) => {
    if (value !== +id) {
      history.push(`/lottery/${value}`);
    }
  };

  const handleOpenBuyTicketsModal = (): void => {
    setBuyTicketsModalVisible(true);
  };

  const handleCloseBuyTicketsModal = (): void => {
    setBuyTicketsModalVisible(false);
  };

  const handleOpenWinningTicketsModal = (): void => {
    setWinningTicketsModalVisible(true);
  };

  const handleCloseWinningTicketsModal = (): void => {
    setWinningTicketsModalVisible(false);
  };

  return (
    <main className="lottery">
      <LotteryPreview />
      <div className="row row-sm">
        <div className="box-shadow box-white lottery__search">
          <Search
            btn
            placeholder="Select lottery number"
            size="md"
            type="number"
            onChange={handleSearch}
          />
        </div>
      </div>
      <div className="row row-md">
        <div className="lottery__content">
          {!id ? <LotteryNotFound /> : ''}

          {id ? (
            <div>
              <LotteryRound index={+id} handleOpenModal={handleOpenWinningTicketsModal} />
            </div>
          ) : (
            ''
          )}
          <div>
            <div className="box-shadow box-white lottery__buy">
              <div className="text-md text-purple text-med">Lottery Tickets</div>
              <Button className="lottery__buy-btn" onClick={handleOpenBuyTicketsModal}>
                <span className="text-white text-bold text-md">Buy Tickets</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <WinningTicketsModal
        isVisible={isWinningTicketsModalVisible}
        handleClose={handleCloseWinningTicketsModal}
      />
      <BuyTicketsModal
        isVisible={isBuyTicketsModalVisible}
        handleClose={handleCloseBuyTicketsModal}
      />
    </main>
  );
};

export default Lottery;
