export const onCheckCondition = (pathname: string, activePath: string) => {
  const isHomeSwap = pathname === activePath || pathname === '/settings' || pathname === '/history';
  const isLiquidity =
    pathname === activePath ||
    pathname === '/liquidity/settings' ||
    pathname === '/liquidity/history' ||
    pathname === '/liquidity/add' ||
    pathname === '/liquidity/remove';

  const condition = activePath === '/' ? isHomeSwap : isLiquidity;
  return condition;
};
