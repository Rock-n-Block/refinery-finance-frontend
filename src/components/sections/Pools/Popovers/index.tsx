import React from 'react';

import { IBasePopover, withPopover } from './BasePopover';

export const AutoFarmingPopover = withPopover(
  'Any funds you stake in this pool will be automagically harvested and restaked (compounded) for you.',
);

export const ManualFarmingPopover = withPopover(
  'You must harvest and compound your earnings from this pool manually.',
);

// ???
// export const createTotalStakedPopoverComponent = (symbol: string) => withPopover(`Total amount of ${symbol} staked in this pool`);

interface ITotalStakedPopoverProps extends Omit<IBasePopover, 'text'> {
  symbol: string;
}
export const TotalStakedPopover: React.FC<ITotalStakedPopoverProps> = ({ symbol, ...props }) => {
  const Component = withPopover(`Total amount of ${symbol} staked in this pool`);
  return <Component {...props} />;
};
