import { getDaysInMonth } from 'date-fns';
import { PickerViewColumnOption } from '../Picker/PickerViewColumn';

/** 获取日期值 */
export const getDefaultPickerValue = (value?: Date) => {
  const date = value || new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();

  return [year, month, day, hour, minute];
};

let globalDate: { [key: string]: PickerViewColumnOption<number>[] } = {};

const getYears = () => {
  if (!globalDate.years!) {
    globalDate.years = Array(180)
      .fill(0)
      .map((_, i) => ({
        label: `${1900 + i}年`,
        value: 1900 + i
      }));
  }

  return globalDate.years;
};

const getMonths = () => {
  if (!globalDate.months) {
    globalDate.months = Array(12)
      .fill(0)
      .map((_, i) => ({
        label: `${i + 1}月`,
        value: i
      }));
  }
  return globalDate.months;
};

const getDays = (count: number) => {
  if (!globalDate[count]) {
    globalDate[count] = Array(count)
      .fill(0)
      .map((_, i) => ({
        label: `${i + 1}日`,
        value: i + 1
      }));
  }

  return globalDate[count];
};

const getDaysOptions = () => {
  if (!globalDate.days) {
    globalDate.days = Array(24)
      .fill(0)
      .map((_, i) => ({
        label: `${i}时`,
        value: i
      }));
  }
  return globalDate.days;
};

const getMinuteOptions = () => {
  if (!globalDate.minute) {
    globalDate.minute = Array(60)
      .fill(0)
      .map((_, i) => ({
        label: `${i}分`,
        value: i
      }));
  }
  return globalDate.minute;
};

/** 获取可选值 */
export const getPickerOptions = ([year, month]: number[]) => {
  const dayCount = getDaysInMonth(new Date(year, month));

  return [
    getYears(),
    getMonths(),
    getDays(dayCount),
    getDaysOptions(),
    getMinuteOptions()
  ];
};
