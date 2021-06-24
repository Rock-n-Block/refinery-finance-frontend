import React from 'react';

import { useWalletConnectorContext } from '../services/MetamaskConnect';
import config from '../services/web3/config';

import { ITokens } from '../types';

const TradeWrapper = (Component: React.FC<any>) => {
  const connector = useWalletConnectorContext();

  return class TradeWrapperComponent extends React.Component<any, any> {
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
      };

      this.handleChangeTokensData = this.handleChangeTokensData.bind(this);
      this.handleApproveTokens = this.handleApproveTokens.bind(this);
      this.handleChangeAllowanceFrom = this.handleChangeAllowanceFrom.bind(this);
    }

    handleChangeTokensData(tokensData: ITokens) {
      this.setState({
        tokensData,
      });
    }

    async handleApproveTokens() {
      try {
        if (!this.state.isAllowanceFrom) {
          await connector.metamaskService.approveToken({
            contractName: 'ERC20',
            approvedAddress: config.ROUTER.ADDRESS,
            tokenAddress: '0xcfcd0fe9edbbc4a246825e0cd003e48573cc920e',
          });
          this.setState({
            isAllowanceFrom: true,
          });
        }
      } catch (err) {
        this.setState({
          isAllowanceFrom: false,
        });
        console.log('err approve tokens', err);
      }
    }

    handleChangeAllowanceFrom(value: boolean) {
      this.setState({
        isAllowanceFrom: value,
      });
    }

    render() {
      return (
        <Component
          {...this.props}
          tokensData={this.state.tokensData}
          setTokensData={this.handleChangeTokensData}
          setAllowanceFrom={this.handleChangeAllowanceFrom}
          isAllowanceFrom={this.state.isAllowanceFrom}
          handleApproveTokens={this.handleApproveTokens}
        />
      );
    }
  };
};

export default TradeWrapper;
