export interface IToken {
  logoURI?: string;
  name: string;
  symbol: string;
  address: string;
  chainId?: number;
  decimals: number | string;
}

export interface ITokens {
  from: {
    token: IToken | undefined;
    amount: number;
  };
  to: {
    token: IToken | undefined;
    amount: number;
  };
}

export interface ISettings {
  slippage: IActiveSlippage;
  txDeadline: number;
  txDeadlineUtc: number;
}

export interface IActiveSlippage {
  type: 'btn' | 'input';
  value: number;
}

export interface ITeamCard {
  place: number;
  name: string;
  details: string;
  members: number;
  win: number;
  img: string;
  id: number | string;
}

export interface IRecentTx {
  type: string;
  address: string;
  from: {
    symbol: string;
    value: number | string;
    img?: string;
  };
  to: {
    symbol: string;
    value: number | string;
    img?: string;
  };
}
