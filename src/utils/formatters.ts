import BigNumber from 'bignumber.js/bignumber';
import { getFullDisplayBalance } from './bignumberFormatters';

export const numberWithCommas = (number: number): string => {
  const parts = number.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};

export function feeFormatter(
  fee: null | undefined,
  maxValue?: number,
  noDataDummy?: string,
): string;
export function feeFormatter(fee: number, maxValue?: number, noDataDummy?: string): number;
export function feeFormatter(
  fee: number | null | undefined,
  maxValue?: number,
  noDataDummy?: string,
): number | string;
export function feeFormatter(
  fee: number | null | undefined,
  maxValue = 100,
  noDataDummy = '###',
): string | number {
  if (fee === null || fee === undefined) return noDataDummy;
  return fee / maxValue;
}

export const loadingDataFormatter = (
  value?: number | string | null | undefined | BigNumber,
  options: {
    noDataDummy?: string;
    decimals?: number;
    displayDecimals?: number;
  } = {},
): string | number => {
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

export const addressShortener = (address: string, charsCountToShow = 10): string => {
  const startCharsCount = Math.floor(charsCountToShow / 2) + 1;
  const lastCharsCount = Math.floor(charsCountToShow / 2) - 1;

  const addressAsArray = address.split('');
  addressAsArray.splice(
    startCharsCount,
    address.length - (startCharsCount + lastCharsCount),
    '...',
  );
  return addressAsArray.join('');
};

export const ipfsShortener = (ipfsHash: string, charsCountToShow = 6): string => {
  return `#${ipfsHash.slice(0, charsCountToShow)}`;
};
