export const onCheckCondition = (pathname: string, activePath: string) => {
  const isHomeSwap = pathname === activePath || pathname === '/settings' || pathname === '/history';
  const isLiquidity = pathname.includes('liquidity');
  // pathname === activePath ||
  // pathname === '/liquidity/settings' ||
  // pathname === '/liquidity/history' ||
  // pathname === '/liquidity/add' ||
  // pathname === '/liquidity/remove' ||
  // pathname === '/liquidity/receive' ||
  // pathname === '/liquidity/add/:currencyIdA/:currencyIdB';

  const condition = activePath === '/' ? isHomeSwap : isLiquidity;
  return condition;
};
