import React from 'react';

import { useWalletConnectorContext } from '../services/MetamaskConnect';
import config from '../services/web3/config';
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
}

const TradeWrapper = (Component: React.FC<any>, compProps?: any) => {
  const connector = useWalletConnectorContext();

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
      };

      this.handleChangeTokensData = this.handleChangeTokensData.bind(this);
      this.handleApproveTokens = this.handleApproveTokens.bind(this);
      this.handleChangeAllowanceFrom = this.handleChangeAllowanceFrom.bind(this);
      this.handleChangeAllowanceTo = this.handleChangeAllowanceTo.bind(this);
    }

    handleChangeTokensData(tokensData: ITokens) {
      this.setState({
        tokensData,
      });
    }

    async handleApproveTokens() {
      try {
        if (!this.state.isAllowanceFrom && this.state.tokensData.from.token) {
          await connector.metamaskService.approveToken({
            contractName: 'ERC20',
            approvedAddress: config.ROUTER.ADDRESS,
            tokenAddress: this.state.tokensData.from.token.address,
          });
          this.setState({
            isAllowanceFrom: true,
          });
        }
        if (!this.state.isAllowanceTo && this.state.tokensData.to.token) {
          await connector.metamaskService.approveToken({
            contractName: 'ERC20',
            approvedAddress: config.ROUTER.ADDRESS,
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
        />
      );
    }
  };
};

export default TradeWrapper;
