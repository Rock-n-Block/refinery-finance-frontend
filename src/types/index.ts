export interface IToken {
  logoURI: string;
  name: string;
  symbol: string;
  address?: string;
  chainId?: number;
  decimals?: number;
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
