import React from 'react';

import { Button } from '@/components/atoms';

interface ICollectButtonProps {
  value: number;
  collectHandler: () => void;
}

const CollectButton: React.FC<ICollectButtonProps> = ({ value, collectHandler }) => {
  return (
    <Button
      colorScheme="yellow"
      size="ssm"
      disabled={value === 0}
      onClick={
        value === 0
          ? undefined
          : () => {
              collectHandler();
            }
      }
    >
      <span className="text-white text-ssmd text-bold">Collect</span>
    </Button>
  );
};

export default CollectButton;
