import React from 'react';

import FarmingModeStatus from '@/components/sections/Pools/FarmingModeStatus';
import OpenLink from '@/components/sections/Pools/OpenLink';
import { AutoFarmingPopover, ManualFarmingPopover } from '@/components/sections/Pools/Popovers';
import { IPoolFarmingMode, PoolFarmingMode } from '@/types';

const links = [
  {
    href: '/',
    text: 'See Token Info',
  },
  {
    href: '/',
    text: 'View Project Site',
  },
  {
    href: '/',
    text: 'View Contract',
  },
];
// const links = [
//   {
//     href: `/token/${earningToken.address ? getAddress(earningToken.address) : ''}`,
//     text: 'See Token Info',
//   },
//   {
//     href: earningToken.projectLink,
//     text: 'View Project Site',
//   },
//   {
//     href: `https://bscscan.com/address/${
//       type === PoolFarmingMode.auto
//         ? getContractAddress('REFINERY_VAULT')
//         : getAddress(pool.contractAddress)
//     }`,
//     text: 'View Contract',
//   },
// ];

const DetailsLinks: React.FC<{ farmMode: IPoolFarmingMode }> = ({ farmMode }) => {
  return (
    <div className="pools-table-row__details-links">
      {links.map(({ href, text }) => (
        <OpenLink
          key={href + text}
          className="pools-table-row__details-links-item"
          href={href}
          text={text}
        />
      ))}
      <div className="box-f-c">
        <FarmingModeStatus type={farmMode} />
        {farmMode === PoolFarmingMode.auto ? (
          <AutoFarmingPopover className="pools-table-row__details-info-popover" />
        ) : (
          <ManualFarmingPopover className="pools-table-row__details-info-popover" />
        )}
      </div>
    </div>
  );
};

export default DetailsLinks;
