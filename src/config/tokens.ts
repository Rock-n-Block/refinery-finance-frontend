import { Token } from '@/types';

const NO_LOGO = 'https://kovan.etherscan.io/images/main/empty-token.png';

export const tokens: Record<'tst' | 'rp1' | 'fuel' | 'wbnb' | 'tmpt' | 'bbshk' | 'busd', Token> = {
  tst: {
    symbol: 'TST',
    address: {
      42: '0x75ad1de90e9d95fcc26e16e332d2f2c5fca24691',
      // 56: '0xf750a26eb0acf95556e8529e72ed530f3b60f348',
    },
    decimals: 18,
    projectLink: 'https://www.example.com/',
    logoURI: NO_LOGO,
  },
  rp1: {
    symbol: 'RP1',
    address: {
      42: '0x6e32b62576b6344226edd2a8c347f54bfe5deb74',
      // 56: '0x07663837218a003e66310a01596af4bf4e44623d',
    },
    decimals: 18,
    projectLink: 'https://www.example.com/',
    logoURI: NO_LOGO,
  },
  fuel: {
    symbol: 'FUEL',
    address: {
      42: '0x251a340069189d5507c81325df5520ba2afb1089',
    },
    decimals: 18,
    projectLink: 'https://www.example.com/',
    logoURI: NO_LOGO,
  },
  wbnb: {
    symbol: 'WBNB',
    address: {
      42: '0x4aff3e144ce07342be999ba093948dfd58b1a0a9',
    },
    decimals: 18,
    projectLink: 'https://www.example.com/',
    logoURI: NO_LOGO,
  },
  tmpt: {
    symbol: 'TMPT',
    address: {
      42: '0x19cd26a630c890b886034077701998551ce09aa6',
    },
    decimals: 18,
    projectLink: 'https://www.example.com/',
    logoURI: NO_LOGO,
  },
  bbshk: {
    symbol: 'BBSHK',
    address: {
      42: '0xF1776D2e185151FC178ecd9D9E8304eBB0922e7b',
    },
    decimals: 18,
    projectLink: 'https://www.example.com/',
    logoURI: NO_LOGO,
  },
  busd: {
    symbol: 'BUSD',
    address: {
      42: '0x5a9221ac897ef8a9cb77e61f9c1beafe00440169',
    },
    decimals: 18,
    projectLink: 'https://www.example.com/',
    logoURI: NO_LOGO,
  }
};
