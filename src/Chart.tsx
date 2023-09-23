import { FC, useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { add, format, differenceInCalendarDays, isFuture } from 'date-fns';

import data from './data';

import './style.css';

let count = 0;

const dateFormatter = (date) => {
  return format(new Date(date), 'dd/MMM');
};

/**
 * get the dates between `startDate` and `endSate` with equal granularity
 */
const getTicks = (startDate, endDate, num) => {
  const diffDays = differenceInCalendarDays(endDate, startDate);

  let current = startDate,
    velocity = Math.round(diffDays / (num - 1));

  const ticks = [startDate.getTime()];

  for (let i = 1; i < num - 1; i++) {
    ticks.push(add(current, { days: i * velocity }).getTime());
  }

  ticks.push(endDate.getTime());
  return ticks;
};

/**
 * Add data of the date in ticks,
 * if there is no data in that date in `data`.
 *
 * @param Array<number> _ticks
 * @param {*} data
 */
const fillTicksData = (_ticks, data) => {
  const ticks = [..._ticks];
  const filled = [];
  let currentTick = ticks.shift();
  let lastData = null;
  for (const it of data) {
    if (ticks.length && it.date > currentTick && lastData) {
      filled.push({ ...lastData, ...{ date: currentTick } });
      currentTick = ticks.shift();
    } else if (ticks.length && it.date === currentTick) {
      currentTick = ticks.shift();
    }

    filled.push(it);
    lastData = it;
  }

  return filled;
};

const data2 = data.map((d: any) => {
  count++;
  return {
    date: new Date(d.created_at),
    count,
  };
});

const Chart: FC<{}> = () => {
  const startDate = data2[0].date;
  // const endDate = new Date(2019, 9, 15);
  const endDate = data2[data2.length - 1].date;
  console.log({ data2, startDate, endDate });

  const domain = [(dataMin) => dataMin, () => endDate.getTime()];
  const ticks = getTicks(startDate, endDate, 5);
  const filledData = fillTicksData(ticks, data2);

  return (
    <ResponsiveContainer width="90%" height={200}>
      <AreaChart
        width={900}
        height={250}
        data={filledData}
        margin={{
          top: 10,
          right: 0,
          bottom: 10,
          left: 0,
        }}
      >
        <XAxis
          dataKey="date"
          hasTick
          scale="time"
          tickFormatter={dateFormatter}
          type="number"
          domain={domain}
          ticks={ticks}
        />
        <YAxis tickCount={7} hasTick />
        {/* <Tooltip content={<CustomTooltip />} /> */}
        <Area
          type="monotone"
          dataKey="count"
          stroke="#ff7300"
          fill="#ff7300"
          fillOpacity={0.9}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default Chart;
