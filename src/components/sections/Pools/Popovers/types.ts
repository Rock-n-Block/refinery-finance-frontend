import { IBasePopover } from './BasePopover';

export interface ITotalStakedPopoverProps extends Omit<IBasePopover, 'text'> {
  symbol: string;
}

export interface IAutoBountyPopoverProps extends Omit<IBasePopover, 'text'> {
  symbol: string;
  fee: number | null;
}

export interface IPoolsCollectPopoverProps extends Omit<IBasePopover, 'text'> {
  symbol: string;
}
