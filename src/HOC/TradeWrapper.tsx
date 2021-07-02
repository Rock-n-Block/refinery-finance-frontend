import React from 'react';

import { useWalletConnectorContext } from '../services/MetamaskConnect';
import Web3Config from '../services/web3/config';
import MetamaskService from '../services/web3';
import { IToken, ITokens } from '../types';

interface ITradeWrapper {
  isAllowanceFrom: boolean;
  isAllowanceTo: boolean;
  tokensData: {
    from: {
      token: IToken | undefined;
      amount: number;
    };
    to: {
      token: IToken | undefined;
      amount: number;
    };
  };
  tokensResurves: any;
}

const TradeWrapper = (Component: React.FC<any>, compProps?: any) => {
  const { metamaskService } = useWalletConnectorContext();

  return class TradeWrapperComponent extends React.Component<any, ITradeWrapper> {
    constructor(props: any) {
      super(props);

      this.state = {
        tokensData: {
          from: {
            token: undefined,
            amount: NaN,
          },
          to: {
            token: undefined,
            amount: NaN,
          },
        },
        isAllowanceFrom: true,
        isAllowanceTo: true,
        tokensResurves: null,
      };

      this.handleChangeTokensData = this.handleChangeTokensData.bind(this);
      this.handleApproveTokens = this.handleApproveTokens.bind(this);
      this.handleChangeAllowanceFrom = this.handleChangeAllowanceFrom.bind(this);
      this.handleChangeAllowanceTo = this.handleChangeAllowanceTo.bind(this);
      this.handleGetExchange = this.handleGetExchange.bind(this);
    }

    handleChangeTokensData(tokensData: ITokens, type?: 'from' | 'to') {
      if (tokensData.from.amount === 0 || tokensData.to.amount === 0) {
        this.setState({
          tokensData: {
            from: {
              token: tokensData.from.token,
              amount: 0,
            },
            to: {
              token: tokensData.to.token,
              amount: 0,
            },
          },
        });
      } else if (tokensData.from.token && tokensData.to.token) {
        this.handleGetExchange(tokensData, type);
      } else {
        this.setState({
          tokensData,
        });
      }
    }

    async handleApproveTokens() {
      try {
        if (!this.state.isAllowanceFrom && this.state.tokensData.from.token) {
          await metamaskService.approveToken({
            contractName: 'ERC20',
            approvedAddress: Web3Config.ROUTER.ADDRESS,
            tokenAddress: this.state.tokensData.from.token.address,
          });
          this.setState({
            isAllowanceFrom: true,
          });
        }
        if (!this.state.isAllowanceTo && this.state.tokensData.to.token) {
          await metamaskService.approveToken({
            contractName: 'ERC20',
            approvedAddress: Web3Config.ROUTER.ADDRESS,
            tokenAddress: this.state.tokensData.to.token.address,
          });
          this.setState({
            isAllowanceTo: true,
          });
        }
      } catch (err) {
        this.setState({
          isAllowanceFrom: false,
          isAllowanceTo: false,
        });
        console.log('err approve tokens', err);
      }
    }

    async handleGetExchange(tokens: ITokens, type?: 'from' | 'to') {
      try {
        const pairAddr = await metamaskService.callContractMethod('FACTORY', 'getPair', [
          tokens.from.token?.address,
          tokens.to.token?.address,
        ]);
        if (pairAddr === '0x0000000000000000000000000000000000000000') {
          this.setState({
            tokensResurves: null,
          });
          return;
        }

        if (
          tokens.from.token &&
          tokens.to.token &&
          (tokens.from.amount || tokens.to.amount) &&
          pairAddr
        ) {
          const token0 = await metamaskService.callContractMethodFromNewContract(
            pairAddr,
            Web3Config.PAIR.ABI,
            'token0',
          );

          const token1 = await metamaskService.callContractMethodFromNewContract(
            pairAddr,
            Web3Config.PAIR.ABI,
            'token1',
          );

          const resurves = await metamaskService.callContractMethodFromNewContract(
            pairAddr,
            Web3Config.PAIR.ABI,
            'getReserves',
          );
          this.setState({
            tokensResurves: resurves,
          });

          if (
            (type === 'from' && tokens.from.amount) ||
            (tokens.from.token && tokens.from.amount && !tokens.to.amount)
          ) {
            let resurve1: number;
            let resurve2: number;
            if (tokens.from.token.address.toLowerCase() === token0.toLowerCase()) {
              resurve1 = resurves['0'];
              resurve2 = resurves['1'];
            } else {
              resurve1 = resurves['1'];
              resurve2 = resurves['0'];
            }

            const quote = await metamaskService.callContractMethod('ROUTER', 'quote', [
              MetamaskService.calcTransactionAmount(
                tokens.from.amount,
                +tokens.from.token.decimals,
              ),
              resurve1,
              resurve2,
            ]);

            this.setState({
              tokensData: {
                from: {
                  token: tokens.from.token,
                  amount: tokens.from.amount,
                },
                to: {
                  token: tokens.to.token,
                  amount: +MetamaskService.amountFromGwei(+quote, +tokens.to.token.decimals),
                },
              },
            });
          } else if (
            (type === 'to' && tokens.to.amount) ||
            (tokens.to.token && tokens.to.amount && !tokens.from.amount)
          ) {
            let resurve1: number;
            let resurve2: number;
            if (tokens.to.token.address.toLowerCase() === token1.toLowerCase()) {
              resurve1 = resurves['1'];
              resurve2 = resurves['0'];
            } else {
              resurve1 = resurves['0'];
              resurve2 = resurves['1'];
            }
            const quote = await metamaskService.callContractMethod('ROUTER', 'quote', [
              MetamaskService.calcTransactionAmount(tokens.to.amount, +tokens.to.token.decimals),
              resurve1,
              resurve2,
            ]);

            this.setState({
              tokensData: {
                from: {
                  token: tokens.from.token,
                  amount: +MetamaskService.amountFromGwei(+quote, +tokens.from.token.decimals),
                },
                to: {
                  token: tokens.to.token,
                  amount: tokens.to.amount,
                },
              },
            });
          } else {
            this.setState({
              tokensData: tokens,
            });
          }
        }
      } catch (err) {
        console.log('get pair', err);
      }
    }

    handleChangeAllowanceFrom(value: boolean) {
      this.setState({
        isAllowanceFrom: value,
      });
    }

    handleChangeAllowanceTo(value: boolean) {
      this.setState({
        isAllowanceTo: value,
      });
    }

    render() {
      return (
        <Component
          {...this.props}
          {...compProps}
          tokensData={this.state.tokensData}
          setTokensData={this.handleChangeTokensData}
          setAllowanceFrom={this.handleChangeAllowanceFrom}
          setAllowanceTo={this.handleChangeAllowanceTo}
          isAllowanceFrom={this.state.isAllowanceFrom}
          isAllowanceTo={this.state.isAllowanceFrom}
          handleApproveTokens={this.handleApproveTokens}
          tokensResurves={this.state.tokensResurves}
        />
      );
    }
  };
};

export default TradeWrapper;
