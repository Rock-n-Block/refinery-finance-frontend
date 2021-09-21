/**
 * Given APR returns APY
 * @param apr APR as percentage
 * @param compoundFrequency how many compounds per day
 * @param days if other than 365 adjusts (A)PY for period less than a year
 * @param performanceFee performance fee as percentage
 * @returns APY as decimal
 */
export const getApy = (apr: number, compoundFrequency = 1, days = 365, performanceFee = 0) => {
  const daysAsDecimalOfYear = days / 365;
  const aprAsDecimal = apr / 100;
  const timesCompounded = 365 * compoundFrequency;
  let apyAsDecimal = (apr / 100) * daysAsDecimalOfYear;
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
