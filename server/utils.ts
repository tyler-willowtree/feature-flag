import { Dayjs } from 'dayjs';
import * as dayjs from 'dayjs';

const getBetween = (from: Dayjs, to: Dayjs) => {
  const fromMilli = from.valueOf();
  const max = to.valueOf() - fromMilli;

  const dateOffset = Math.floor(Math.random() * max + 1);

  const newDate = dayjs(fromMilli + dateOffset);

  return dayjs(newDate);
};

const getSoon = (days = 1, refDate = dayjs()) => {
  const ref = dayjs(refDate);
  const to = ref.add(days, 'day');

  return getBetween(ref, to);
};

const getRecent = (days = 1, refDate = dayjs()) => {
  const ref = dayjs(refDate);
  const from = ref.subtract(days, 'day');

  return getBetween(from, ref);
};

const getFuture = (years = 1, refDate = dayjs()) => {
  const ref = dayjs(refDate);
  const to = ref.add(years, 'year');

  return getBetween(ref, to);
};

export const getPast = (years = 1, refDate = undefined) => {
  const ref = refDate ? dayjs(refDate) : dayjs();
  const from = ref.subtract(years, 'year');

  return getBetween(from, ref);
};
