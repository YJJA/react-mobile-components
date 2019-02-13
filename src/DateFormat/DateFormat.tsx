import * as React from 'react';
import dateformat from 'date-fns/format';
import dateparse from 'date-fns/parse';

export interface IDateFormatProps {
  value: any;
  format?: string;
}

export const DateFormat = ({
  value,
  format = 'YYYY-MM-DD',
}: IDateFormatProps) => {
  return <span>{dateformat(dateparse(value), format)}</span>;
};
