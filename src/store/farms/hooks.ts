import { Farm } from '@/types';
import { useMst } from '..';

export const useFarms = (): { farms: Farm[] } => {
  const { farms } = useMst();

  return { farms: farms.data.slice() as Farm[] };
};
