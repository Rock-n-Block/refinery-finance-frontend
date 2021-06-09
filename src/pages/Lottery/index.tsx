import React from 'react';
import { useParams, useHistory } from 'react-router-dom';

import { LotteryPreview, LotteryNotFound } from '../../components/sections/Lottery';
import { Search } from '../../components/atoms';

import './Lottery.scss';

interface ILotteryId {
  id: string;
}

const Lottery: React.FC = () => {
  const history = useHistory();
  const { id } = useParams<ILotteryId>();
  console.log(id);

  const handleSearch = (value: number | string) => {
    if (value !== +id) {
      history.push(`/lottery/${value}`);
    }
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
        <div className="lottery__content">{!id ? <LotteryNotFound /> : ''}</div>
      </div>
    </main>
  );
};

export default Lottery;
