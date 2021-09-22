// import React, { useEffect, useState } from 'react';
import React from 'react';

import { useSelectVaultData } from '@/store/pools/hooks';

import { durationFormatter } from '../../utils';
import useWithdrawalFeeTimer from '@/hooks/pools/useWithdrawalTimer';
import { BIG_ZERO } from '@/utils';

// const mockData = {
//   timeLeft: 2 * 24 * 60 * 60 * 1000 + 23 * 60 * 60 * 1000 + 31 * 60 * 1000,
// };

const UnstakingFeeTimer: React.FC = () => {
  const {
    userData: { lastDepositedTime, userShares },
    fees: { withdrawalFeePeriod },
  } = useSelectVaultData();
  const { secondsRemaining } = useWithdrawalFeeTimer(
    parseInt(lastDepositedTime || '0', 10),
    userShares || BIG_ZERO,
    withdrawalFeePeriod || undefined,
  );
  // const [MOCK_timeLeft, MOCK_setTimeLeft] = useState(mockData.timeLeft);
  // useEffect(() => {
  //   const intervalId = setTimeout(() => {
  //     if (MOCK_timeLeft === 0) {
  //       clearTimeout(intervalId);
  //     } else {
  //       MOCK_setTimeLeft(MOCK_timeLeft - 60 * 1000);
  //     }
  //   }, 1000);
  //   return () => {
  //     clearTimeout(intervalId);
  //   };
  // }, [MOCK_timeLeft]);

  return (
    <div className="text-purple text-smd text-med">
      {durationFormatter((secondsRemaining || 0) * 1000)}
    </div>
  );
};

export default UnstakingFeeTimer;
