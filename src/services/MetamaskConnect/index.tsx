import React, { createContext, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';

import rootStore from '../../store';
import MetamaskService from '../web3';

const walletConnectorContext = createContext<any>({
  MetamaskService: {},
  connect: (): void => {},
});

@observer
class Connector extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      provider: new MetamaskService({
        testnet: 'bsct',
      }),
    };

    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
  }

  componentDidMount() {
    const self = this;

    if (localStorage.refFinanceMetamask) {
      this.connect();
    }

    this.state.provider.chainChangedObs.subscribe({
      next(err: string) {
        rootStore.modals.metamaskErr.setErr(err);
      },
    });

    this.state.provider.accountChangedObs.subscribe({
      next() {
        self.disconnect();
      },
    });
  }

  connect = async () => {
    try {
      const { address } = await this.state.provider.connect();

      rootStore.user.setAddress(address);
      localStorage.refFinanceMetamask = true;
    } catch (err) {
      rootStore.modals.metamaskErr.setErr(err.message);
      this.disconnect();
    }
  };

  disconnect = () => {
    rootStore.user.disconnect();

    // if (
    //   ['/create/single', '/create/multi', '/profile', '/create'].includes(
    //     this.props.location.pathname,
    //   )
    // ) {
    //   this.props.history.push('/');
    // }
  };

  render() {
    return (
      <walletConnectorContext.Provider
        value={{
          metamaskService: this.state.provider,
          connect: this.connect,
          disconnect: this.disconnect,
        }}
      >
        {this.props.children}
      </walletConnectorContext.Provider>
    );
  }
}

export default withRouter(Connector);

export function useWalletConnectorContext() {
  return useContext(walletConnectorContext);
}