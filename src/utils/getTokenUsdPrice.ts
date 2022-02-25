import BigNumber from 'bignumber.js/bignumber';
import { Precisions } from '@/types';
import { toBigNumber } from './toBigNumber';
/**
 * Converts tokens amount to usd amount.
 */
export function getTokenUsdPrice(
  amount: number | string | BigNumber,
  tokenUsdPrice: number | string | BigNumber,
): string;
export function getTokenUsdPrice(
  amount: number | string | BigNumber,
  tokenUsdPrice: number | string | BigNumber,
  humanFriendly: true,
): string;
export function getTokenUsdPrice(
  amount: number | string | BigNumber,
  tokenUsdPrice: number | string | BigNumber,
  humanFriendly: false,
): BigNumber;
export function getTokenUsdPrice(
  amount: number | string | BigNumber,
  tokenUsdPrice: number | string | BigNumber,
  humanFriendly = true,
): BigNumber | string {
  const convertedTokenPrice = toBigNumber(amount).times(tokenUsdPrice);
  return humanFriendly ? convertedTokenPrice.toFixed(Precisions.fiat) : convertedTokenPrice;
}
