export const numberWithCommas = (number: number): string => {
  const parts = number.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};

export function throttle(func: (...props: any) => any, ms: number): (...args: any) => any {
  let isThrottled = false;
  let savedArgs: any;
  let savedThis: any;

  function wrapper(...args: any) {
    if (isThrottled) {
      savedArgs = args;
      savedThis = this;
      return;
    }

    func.apply(this, args);

    isThrottled = true;

    setTimeout(() => {
      isThrottled = false;
      if (savedArgs) {
        wrapper.apply(savedThis, savedArgs);
        savedArgs = null;
        savedThis = null;
      }
    }, ms);
  }

  return wrapper;
}

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
// TODO: remove any :D

export function debounce(
  func: (...props: any) => any,
  wait: number,
  immediate: boolean,
): (...args: any[]) => void {
  let timeout: any;
  return function debouncedFunc(...args: any[]) {
    const context = this as any;
    const later = function later() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}
