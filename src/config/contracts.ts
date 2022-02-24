import {
  Erc20,
  MasterRefiner,
  Multicall,
  Pair,
  RefineryVault,
  RocketFactory,
  RocketPropellant,
  Router,
  SmartRefinerInitializable,
} from './abi';

// all of the current contracts are in 42 network

export const contracts = {
  ROUTER: {
    ADDRESS: '0x5758356b218602fF39F227205Db4A1aa07548f7a',
    ABI: Router,
  },
  FACTORY: {
    ADDRESS: '0x0176783aa9160c8fFA7E8f31F51dFbfFD63A8b1c',
    ABI: RocketFactory,
  },
  ERC20: {
    ABI: Erc20,
  },
  PAIR: {
    ADDRESS: '0xc36AfeA215679D1aa4F15C29378dBF29D560492c',
    ABI: Pair,
  },
  RP1: {
    ADDRESS: '0x46D47456454dA7f5F2f3a831D0fdF264D940AaB3',
    ABI: RocketPropellant,
  },
  REFINERY_VAULT: {
    ADDRESS: '0xb0F0d907B7d4E869280A1F3cEDa4a3E8C48cE308',
    ABI: RefineryVault,
  },
  MULTICALL: {
    ADDRESS: '0x52dcE21E7923890c338C91FDDfa5a930dc58B553',
    ABI: Multicall,
  },
  SMART_REFINER_INITIALIZABLE: {
    ABI: SmartRefinerInitializable,
  },
  MASTER_REFINER: {
    ADDRESS: '0x9d09e68e0BF54b12e26CeE52cA7Fda24C571e153',
    ABI: MasterRefiner,
  },
};
