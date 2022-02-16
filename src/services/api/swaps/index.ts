import axios from 'axios';

import { TRADE_API } from '@/config/constants/trade';

export const onGetGraphSwaps = async (userAddress: string): Promise<any> => {
  try {
    const { data } = await axios.post(TRADE_API, {
      query: `
      {
        swaps(where: {from: "${userAddress}"}, orderBy: timestamp, orderDirection: desc) {
          transaction {
            id
          }
          pair {
            token0 {
              symbol
            }
            token1 {
              symbol
            }
          }
          amount0In
          amount0Out
          amount1In
          amount1Out
          timestamp 
        }
        burns (where: {sender: "${userAddress}"})  {
          amount0
          amount1
        }
        mints (where: {sender: "${userAddress}"})  {
          amount0
          amount1
        }
      }
      `,
    });
    return data.data;
  } catch (error) {
    return error;
  }
};

export const getAllPairs = async () => {
  try {
    const { data } = await axios.post(TRADE_API, {
      query: `
      {
        pairs {
          name
          id
         token0 {
           id
          }
         token1 {
           id
          }
        }
      }
      `,
    });
    return data.data;
  } catch (error) {
    return error;
  }
};
