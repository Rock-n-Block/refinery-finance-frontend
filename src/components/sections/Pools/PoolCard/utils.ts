import moment from 'moment';

export const durationFormatter = (timeLeft: number, separator = ' : ') => {
  const duration = moment.duration(timeLeft);
  const items = [`${duration.days()}d`, `${duration.hours()}h`, `${duration.minutes()}m`];
  return items.join(separator);
};
