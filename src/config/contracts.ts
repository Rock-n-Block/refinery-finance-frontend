import {
  MasterRefiner,
  Multicall,
  RefineryVault,
  RocketFactory,
  RocketPropellant,
  SmartRefinerInitializable,
} from './abi';

// all of the current contracts are in 42 network

export const contracts = {
  ROUTER: {
    ADDRESS: '0x7DD7FAac86C987c56F5BE16d2f62379B4C588d93',
    // ADDRESS: '0x5758356b218602fF39F227205Db4A1aa07548f7a',
    ABI: [
      {
        inputs: [
          { internalType: 'address', name: '_factory', type: 'address' },
          { internalType: 'address', name: '_WETH', type: 'address' },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
      },
      {
        inputs: [],
        name: 'WETH',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'tokenA', type: 'address' },
          { internalType: 'address', name: 'tokenB', type: 'address' },
          { internalType: 'uint256', name: 'amountADesired', type: 'uint256' },
          { internalType: 'uint256', name: 'amountBDesired', type: 'uint256' },
          { internalType: 'uint256', name: 'amountAMin', type: 'uint256' },
          { internalType: 'uint256', name: 'amountBMin', type: 'uint256' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
        ],
        name: 'addLiquidity',
        outputs: [
          { internalType: 'uint256', name: 'amountA', type: 'uint256' },
          { internalType: 'uint256', name: 'amountB', type: 'uint256' },
          { internalType: 'uint256', name: 'liquidity', type: 'uint256' },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'token', type: 'address' },
          { internalType: 'uint256', name: 'amountTokenDesired', type: 'uint256' },
          { internalType: 'uint256', name: 'amountTokenMin', type: 'uint256' },
          { internalType: 'uint256', name: 'amountETHMin', type: 'uint256' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
        ],
        name: 'addLiquidityETH',
        outputs: [
          { internalType: 'uint256', name: 'amountToken', type: 'uint256' },
          { internalType: 'uint256', name: 'amountETH', type: 'uint256' },
          { internalType: 'uint256', name: 'liquidity', type: 'uint256' },
        ],
        stateMutability: 'payable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'factory',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'uint256', name: 'amountOut', type: 'uint256' },
          { internalType: 'uint256', name: 'reserveIn', type: 'uint256' },
          { internalType: 'uint256', name: 'reserveOut', type: 'uint256' },
        ],
        name: 'getAmountIn',
        outputs: [{ internalType: 'uint256', name: 'amountIn', type: 'uint256' }],
        stateMutability: 'pure',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'uint256', name: 'amountIn', type: 'uint256' },
          { internalType: 'uint256', name: 'reserveIn', type: 'uint256' },
          { internalType: 'uint256', name: 'reserveOut', type: 'uint256' },
        ],
        name: 'getAmountOut',
        outputs: [{ internalType: 'uint256', name: 'amountOut', type: 'uint256' }],
        stateMutability: 'pure',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'uint256', name: 'amountOut', type: 'uint256' },
          { internalType: 'address[]', name: 'path', type: 'address[]' },
        ],
        name: 'getAmountsIn',
        outputs: [{ internalType: 'uint256[]', name: 'amounts', type: 'uint256[]' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'uint256', name: 'amountIn', type: 'uint256' },
          { internalType: 'address[]', name: 'path', type: 'address[]' },
        ],
        name: 'getAmountsOut',
        outputs: [{ internalType: 'uint256[]', name: 'amounts', type: 'uint256[]' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'uint256', name: 'amountA', type: 'uint256' },
          { internalType: 'uint256', name: 'reserveA', type: 'uint256' },
          { internalType: 'uint256', name: 'reserveB', type: 'uint256' },
        ],
        name: 'quote',
        outputs: [{ internalType: 'uint256', name: 'amountB', type: 'uint256' }],
        stateMutability: 'pure',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'tokenA', type: 'address' },
          { internalType: 'address', name: 'tokenB', type: 'address' },
          { internalType: 'uint256', name: 'liquidity', type: 'uint256' },
          { internalType: 'uint256', name: 'amountAMin', type: 'uint256' },
          { internalType: 'uint256', name: 'amountBMin', type: 'uint256' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
        ],
        name: 'removeLiquidity',
        outputs: [
          { internalType: 'uint256', name: 'amountA', type: 'uint256' },
          { internalType: 'uint256', name: 'amountB', type: 'uint256' },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'token', type: 'address' },
          { internalType: 'uint256', name: 'liquidity', type: 'uint256' },
          { internalType: 'uint256', name: 'amountTokenMin', type: 'uint256' },
          { internalType: 'uint256', name: 'amountETHMin', type: 'uint256' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
        ],
        name: 'removeLiquidityETH',
        outputs: [
          { internalType: 'uint256', name: 'amountToken', type: 'uint256' },
          { internalType: 'uint256', name: 'amountETH', type: 'uint256' },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'token', type: 'address' },
          { internalType: 'uint256', name: 'liquidity', type: 'uint256' },
          { internalType: 'uint256', name: 'amountTokenMin', type: 'uint256' },
          { internalType: 'uint256', name: 'amountETHMin', type: 'uint256' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
        ],
        name: 'removeLiquidityETHSupportingFeeOnTransferTokens',
        outputs: [{ internalType: 'uint256', name: 'amountETH', type: 'uint256' }],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'token', type: 'address' },
          { internalType: 'uint256', name: 'liquidity', type: 'uint256' },
          { internalType: 'uint256', name: 'amountTokenMin', type: 'uint256' },
          { internalType: 'uint256', name: 'amountETHMin', type: 'uint256' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
          { internalType: 'bool', name: 'approveMax', type: 'bool' },
          { internalType: 'uint8', name: 'v', type: 'uint8' },
          { internalType: 'bytes32', name: 'r', type: 'bytes32' },
          { internalType: 'bytes32', name: 's', type: 'bytes32' },
        ],
        name: 'removeLiquidityETHWithPermit',
        outputs: [
          { internalType: 'uint256', name: 'amountToken', type: 'uint256' },
          { internalType: 'uint256', name: 'amountETH', type: 'uint256' },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'token', type: 'address' },
          { internalType: 'uint256', name: 'liquidity', type: 'uint256' },
          { internalType: 'uint256', name: 'amountTokenMin', type: 'uint256' },
          { internalType: 'uint256', name: 'amountETHMin', type: 'uint256' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
          { internalType: 'bool', name: 'approveMax', type: 'bool' },
          { internalType: 'uint8', name: 'v', type: 'uint8' },
          { internalType: 'bytes32', name: 'r', type: 'bytes32' },
          { internalType: 'bytes32', name: 's', type: 'bytes32' },
        ],
        name: 'removeLiquidityETHWithPermitSupportingFeeOnTransferTokens',
        outputs: [{ internalType: 'uint256', name: 'amountETH', type: 'uint256' }],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'tokenA', type: 'address' },
          { internalType: 'address', name: 'tokenB', type: 'address' },
          { internalType: 'uint256', name: 'liquidity', type: 'uint256' },
          { internalType: 'uint256', name: 'amountAMin', type: 'uint256' },
          { internalType: 'uint256', name: 'amountBMin', type: 'uint256' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
          { internalType: 'bool', name: 'approveMax', type: 'bool' },
          { internalType: 'uint8', name: 'v', type: 'uint8' },
          { internalType: 'bytes32', name: 'r', type: 'bytes32' },
          { internalType: 'bytes32', name: 's', type: 'bytes32' },
        ],
        name: 'removeLiquidityWithPermit',
        outputs: [
          { internalType: 'uint256', name: 'amountA', type: 'uint256' },
          { internalType: 'uint256', name: 'amountB', type: 'uint256' },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'uint256', name: 'amountOut', type: 'uint256' },
          { internalType: 'address[]', name: 'path', type: 'address[]' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
        ],
        name: 'swapETHForExactTokens',
        outputs: [{ internalType: 'uint256[]', name: 'amounts', type: 'uint256[]' }],
        stateMutability: 'payable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'uint256', name: 'amountOutMin', type: 'uint256' },
          { internalType: 'address[]', name: 'path', type: 'address[]' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
        ],
        name: 'swapExactETHForTokens',
        outputs: [{ internalType: 'uint256[]', name: 'amounts', type: 'uint256[]' }],
        stateMutability: 'payable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'uint256', name: 'amountOutMin', type: 'uint256' },
          { internalType: 'address[]', name: 'path', type: 'address[]' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
        ],
        name: 'swapExactETHForTokensSupportingFeeOnTransferTokens',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'uint256', name: 'amountIn', type: 'uint256' },
          { internalType: 'uint256', name: 'amountOutMin', type: 'uint256' },
          { internalType: 'address[]', name: 'path', type: 'address[]' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
        ],
        name: 'swapExactTokensForETH',
        outputs: [{ internalType: 'uint256[]', name: 'amounts', type: 'uint256[]' }],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'uint256', name: 'amountIn', type: 'uint256' },
          { internalType: 'uint256', name: 'amountOutMin', type: 'uint256' },
          { internalType: 'address[]', name: 'path', type: 'address[]' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
        ],
        name: 'swapExactTokensForETHSupportingFeeOnTransferTokens',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'uint256', name: 'amountIn', type: 'uint256' },
          { internalType: 'uint256', name: 'amountOutMin', type: 'uint256' },
          { internalType: 'address[]', name: 'path', type: 'address[]' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
        ],
        name: 'swapExactTokensForTokens',
        outputs: [{ internalType: 'uint256[]', name: 'amounts', type: 'uint256[]' }],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'uint256', name: 'amountIn', type: 'uint256' },
          { internalType: 'uint256', name: 'amountOutMin', type: 'uint256' },
          { internalType: 'address[]', name: 'path', type: 'address[]' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
        ],
        name: 'swapExactTokensForTokensSupportingFeeOnTransferTokens',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'uint256', name: 'amountOut', type: 'uint256' },
          { internalType: 'uint256', name: 'amountInMax', type: 'uint256' },
          { internalType: 'address[]', name: 'path', type: 'address[]' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
        ],
        name: 'swapTokensForExactETH',
        outputs: [{ internalType: 'uint256[]', name: 'amounts', type: 'uint256[]' }],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'uint256', name: 'amountOut', type: 'uint256' },
          { internalType: 'uint256', name: 'amountInMax', type: 'uint256' },
          { internalType: 'address[]', name: 'path', type: 'address[]' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
        ],
        name: 'swapTokensForExactTokens',
        outputs: [{ internalType: 'uint256[]', name: 'amounts', type: 'uint256[]' }],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      { stateMutability: 'payable', type: 'receive' },
    ],
  },
  FACTORY: {
    ADDRESS: '0x7A55fd36019f1d1237B7F2b20D1eFcE64d405B98',
    // ADDRESS: '0x0176783aa9160c8fFA7E8f31F51dFbfFD63A8b1c',
    ABI: RocketFactory,
  },
  ERC20: {
    ABI: [
      {
        constant: true,
        inputs: [],
        name: 'name',
        outputs: [{ name: '', type: 'string' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          { name: 'guy', type: 'address' },
          { name: 'wad', type: 'uint256' },
        ],
        name: 'approve',
        outputs: [{ name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'totalSupply',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          { name: 'src', type: 'address' },
          { name: 'dst', type: 'address' },
          { name: 'wad', type: 'uint256' },
        ],
        name: 'transferFrom',
        outputs: [{ name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: false,
        inputs: [{ name: 'wad', type: 'uint256' }],
        name: 'withdraw',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'decimals',
        outputs: [{ name: '', type: 'uint8' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [{ name: '', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'symbol',
        outputs: [{ name: '', type: 'string' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          { name: 'dst', type: 'address' },
          { name: 'wad', type: 'uint256' },
        ],
        name: 'transfer',
        outputs: [{ name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: false,
        inputs: [],
        name: 'deposit',
        outputs: [],
        payable: true,
        stateMutability: 'payable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [
          { name: '', type: 'address' },
          { name: '', type: 'address' },
        ],
        name: 'allowance',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      { payable: true, stateMutability: 'payable', type: 'fallback' },
      {
        anonymous: false,
        inputs: [
          { indexed: true, name: 'src', type: 'address' },
          { indexed: true, name: 'guy', type: 'address' },
          { indexed: false, name: 'wad', type: 'uint256' },
        ],
        name: 'Approval',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, name: 'src', type: 'address' },
          { indexed: true, name: 'dst', type: 'address' },
          { indexed: false, name: 'wad', type: 'uint256' },
        ],
        name: 'Transfer',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, name: 'dst', type: 'address' },
          { indexed: false, name: 'wad', type: 'uint256' },
        ],
        name: 'Deposit',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, name: 'src', type: 'address' },
          { indexed: false, name: 'wad', type: 'uint256' },
        ],
        name: 'Withdrawal',
        type: 'event',
      },
    ],
  },
  PAIR: {
    ADDRESS: '0xc36AfeA215679D1aa4F15C29378dBF29D560492c',
    ABI: [
      { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
      {
        anonymous: false,
        inputs: [
          { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
          { indexed: true, internalType: 'address', name: 'spender', type: 'address' },
          { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
        ],
        name: 'Approval',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
          { indexed: false, internalType: 'uint256', name: 'amount0', type: 'uint256' },
          { indexed: false, internalType: 'uint256', name: 'amount1', type: 'uint256' },
          { indexed: true, internalType: 'address', name: 'to', type: 'address' },
        ],
        name: 'Burn',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
          { indexed: false, internalType: 'uint256', name: 'amount0', type: 'uint256' },
          { indexed: false, internalType: 'uint256', name: 'amount1', type: 'uint256' },
        ],
        name: 'Mint',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
          { indexed: false, internalType: 'uint256', name: 'amount0In', type: 'uint256' },
          { indexed: false, internalType: 'uint256', name: 'amount1In', type: 'uint256' },
          { indexed: false, internalType: 'uint256', name: 'amount0Out', type: 'uint256' },
          { indexed: false, internalType: 'uint256', name: 'amount1Out', type: 'uint256' },
          { indexed: true, internalType: 'address', name: 'to', type: 'address' },
        ],
        name: 'Swap',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: false, internalType: 'uint112', name: 'reserve0', type: 'uint112' },
          { indexed: false, internalType: 'uint112', name: 'reserve1', type: 'uint112' },
        ],
        name: 'Sync',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, internalType: 'address', name: 'from', type: 'address' },
          { indexed: true, internalType: 'address', name: 'to', type: 'address' },
          { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
        ],
        name: 'Transfer',
        type: 'event',
      },
      {
        inputs: [],
        name: 'DOMAIN_SEPARATOR',
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'MINIMUM_LIQUIDITY',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'PERMIT_TYPEHASH',
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: '', type: 'address' },
          { internalType: 'address', name: '', type: 'address' },
        ],
        name: 'allowance',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'spender', type: 'address' },
          { internalType: 'uint256', name: 'value', type: 'uint256' },
        ],
        name: 'approve',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'address', name: '', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'address', name: 'to', type: 'address' }],
        name: 'burn',
        outputs: [
          { internalType: 'uint256', name: 'amount0', type: 'uint256' },
          { internalType: 'uint256', name: 'amount1', type: 'uint256' },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'decimals',
        outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'factory',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'getReserves',
        outputs: [
          { internalType: 'uint112', name: '_reserve0', type: 'uint112' },
          { internalType: 'uint112', name: '_reserve1', type: 'uint112' },
          { internalType: 'uint32', name: '_blockTimestampLast', type: 'uint32' },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: '_token0', type: 'address' },
          { internalType: 'address', name: '_token1', type: 'address' },
        ],
        name: 'initialize',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'kLast',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'address', name: 'to', type: 'address' }],
        name: 'mint',
        outputs: [{ internalType: 'uint256', name: 'liquidity', type: 'uint256' }],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'name',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'address', name: '', type: 'address' }],
        name: 'nonces',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'owner', type: 'address' },
          { internalType: 'address', name: 'spender', type: 'address' },
          { internalType: 'uint256', name: 'value', type: 'uint256' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
          { internalType: 'uint8', name: 'v', type: 'uint8' },
          { internalType: 'bytes32', name: 'r', type: 'bytes32' },
          { internalType: 'bytes32', name: 's', type: 'bytes32' },
        ],
        name: 'permit',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'price0CumulativeLast',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'price1CumulativeLast',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'address', name: 'to', type: 'address' }],
        name: 'skim',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'uint256', name: 'amount0Out', type: 'uint256' },
          { internalType: 'uint256', name: 'amount1Out', type: 'uint256' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'bytes', name: 'data', type: 'bytes' },
        ],
        name: 'swap',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'symbol',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function',
      },
      { inputs: [], name: 'sync', outputs: [], stateMutability: 'nonpayable', type: 'function' },
      {
        inputs: [],
        name: 'token0',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'token1',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'totalSupply',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'value', type: 'uint256' },
        ],
        name: 'transfer',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'from', type: 'address' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'value', type: 'uint256' },
        ],
        name: 'transferFrom',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
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
