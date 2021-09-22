/**
 * Given APR returns APY
 * @param apr farm or pool APR as percentage
 * @param compoundFrequency how many compounds per 1 day, e.g. 1 = one per day, 0.142857142 - once per week
 * @param days if other than 365 adjusts (A)PY for period less than a year
 * @param performanceFee performance fee as percentage
 * @returns APY as decimal
 */
export const getApy = ({
  apr,
  compoundFrequency = 1,
  days = 365,
  performanceFee = 0,
}: {
  apr: number;
  compoundFrequency?: number;
  days?: number;
  performanceFee?: number;
}) => {
  const daysAsDecimalOfYear = days / 365;
  // We use decimal values rather than % in the math for both APY and the number of days being calculates as a proportion of the year
  const aprAsDecimal = apr / 100;
  // Everything here is worked out relative to a year, with the asset compounding at the compoundFrequency rate. 1 = once per day
  const timesCompounded = 365 * compoundFrequency;
  let apyAsDecimal = aprAsDecimal * daysAsDecimalOfYear;
  if (timesCompounded > 0) {
    apyAsDecimal =
      (1 + aprAsDecimal / timesCompounded) ** (timesCompounded * daysAsDecimalOfYear) - 1;
  }
  if (performanceFee) {
    const performanceFeeAsDecimal = performanceFee / 100;
    const takenAsPerformanceFee = apyAsDecimal * performanceFeeAsDecimal;
    apyAsDecimal -= takenAsPerformanceFee;
  }
  return apyAsDecimal;
};

export const getRoi = ({
  amountEarned,
  amountInvested,
}: {
  amountEarned: number;
  amountInvested: number;
}) => {
  if (amountInvested === 0) {
    return 0;
  }
  const percentage = (amountEarned / amountInvested) * 100;
  return percentage;
};
