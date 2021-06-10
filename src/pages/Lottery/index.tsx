import React from 'react';
import { useParams, useHistory } from 'react-router-dom';

import {
  LotteryPreview,
  LotteryNotFound,
  LotteryRound,
  WinningTicketsModal,
} from '../../components/sections/Lottery';
import { Search } from '../../components/atoms';

import './Lottery.scss';

interface ILotteryId {
  id: string;
}

const Lottery: React.FC = () => {
  const history = useHistory();
  const { id } = useParams<ILotteryId>();
  console.log(id);

  const [isWinningTikcetsModalVisible, setWinningTicketsModalVisible] = React.useState<boolean>(
    true,
  );

  const handleSearch = (value: number | string) => {
    if (value !== +id) {
      history.push(`/lottery/${value}`);
    }
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
      <div className="row row-md">
        <div className="box-shadow box-white lottery__search">
          <Search
            btn
            placeholder="Select lottery number"
            size="md"
            type="number"
            onChange={handleSearch}
          />
        </div>
        <div className="lottery__content">
          {!id ? <LotteryNotFound /> : ''}

          {id ? (
            <div>
              <LotteryRound index={+id} handleOpenModal={handleOpenWinningTicketsModal} />
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
      <WinningTicketsModal
        isVisible={isWinningTikcetsModalVisible}
        handleClose={handleCloseWinningTicketsModal}
      />
    </main>
  );
};

export default Lottery;
