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
