/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-console */
import { SHOW_LOGS } from '@/config';

export const clog = (data: string): void => {
  if (SHOW_LOGS) {
    console.log(data);
  }
};

export const clogData = (text: string, ...data: any): void => {
  if (SHOW_LOGS) {
    console.log(text, ...data);
  }
};

export const clogGroup = (name: string, end?: boolean): void => {
  if (SHOW_LOGS) {
    if (end) {
      console.groupEnd();
      return;
    }
    console.group(name);
  }
};
