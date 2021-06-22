export interface IToken {
  img: string;
  name: string;
  symbol: string;
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
