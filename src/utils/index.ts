import { SCANNERS } from '@/config';
import BigNumber from 'bignumber.js/bignumber';

import { getFullDisplayBalance } from './formatBalance';

export const numberWithCommas = (number: number): string => {
  const parts = number.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};

export function throttle(func: (...props: any) => any, ms: number): (...args: any) => any {
  let isThrottled = false;
  let savedArgs: any;
  let savedThis: any;

  function wrapper(...args: any) {
    if (isThrottled) {
      savedArgs = args;
      savedThis = this;
      return;
    }

    func.apply(this, args);

    isThrottled = true;

    setTimeout(() => {
      isThrottled = false;
      if (savedArgs) {
        wrapper.apply(savedThis, savedArgs);
        savedArgs = null;
        savedThis = null;
      }
    }, ms);
  }

  return wrapper;
}

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
// TODO: remove any :D

export function debounce(
  func: (...props: any[]) => any,
  wait: number,
  immediate: boolean,
): (...args: []) => void {
  let timeout: any;
  return function debouncedFunc(...args: []) {
    const context = this as any;
    const later = function later() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

export const feeFormatter = (
  fee: number | null | undefined,
  maxValue = 100,
  noDataDummy = '###',
) => {
  return fee === null || fee === undefined ? noDataDummy : fee / maxValue;
};

export const loadingDataFormatter = (
  value?: number | string | null | undefined | BigNumber,
  options: {
    noDataDummy?: string;
    decimals?: number;
    displayDecimals?: number;
  } = {},
) => {
  const { noDataDummy = '###', ...otherOptions } = options;
  if (value === null || value === undefined) return noDataDummy;
  return getFullDisplayBalance({
    balance: BigNumber.isBigNumber(value) ? value : new BigNumber(value),
    ...otherOptions,
    // decimals: options?.decimals,
    // displayDecimals: options?.
  });
  // return getBalanceAmount(BigNumber.isBigNumber(value) ? value : new BigNumber(value));
};

export const BIG_ZERO = new BigNumber(0);
export const BIG_TEN = new BigNumber(10);

export const MAX_UINT_256: BigNumber = new BigNumber(
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
);

export const DEFAULT_TOKEN_DECIMAL = BIG_TEN.pow(18);

export const convertToBigNumber = (val: string | null): BigNumber | null => {
  return val === null ? val : new BigNumber(val);
};

export const getBaseScannerUrl = (chainId: number | string): string => {
  return SCANNERS[Number(chainId)];
};
