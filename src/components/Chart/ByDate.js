import React, { useState, useLayoutEffect, useRef, useMemo } from "react";
import * as d3 from "d3";
import "./Chart.css";

const formatMillisecond = d3.timeFormat(".%L"),
  formatSecond = d3.timeFormat(":%S"),
  formatMinute = d3.timeFormat("%I:%M"),
  formatHour = d3.timeFormat("%B %d"),
  formatDay = d3.timeFormat("%a"),
  formatWeek = d3.timeFormat("%b %d"),
  formatMonth = d3.timeFormat("%B"),
  formatYear = d3.timeFormat("%Y");

function multiFormat(date) {
  return (
    d3.timeSecond(date) < date
      ? formatMillisecond
      : d3.timeMinute(date) < date
      ? formatSecond
      : d3.timeHour(date) < date
      ? formatMinute
      : d3.timeDay(date) < date
      ? formatHour
      : d3.timeMonth(date) < date
      ? d3.timeWeek(date) < date
        ? formatDay
        : formatWeek
      : d3.timeYear(date) < date
      ? formatMonth
      : formatYear
  )(date);
}

function AxisBottom({ scale, transform, ticks }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    if (ref.current) {
      d3.select(ref.current).call(
        d3.axisBottom(scale)
        // d3.axisBottom(scale).tickFormat(multiFormat).tickValues(ticks)
      );
    }
  }, [scale]);

  return <g ref={ref} transform={transform} />;
}

function AxisLeft({ scale }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    if (ref.current) {
      d3.select(ref.current).call(
        d3.axisLeft(scale).ticks(4).tickFormat(d3.format(".2s"))
      );
    }
  }, [scale]);

  return <g ref={ref} />;
}

function Bars({ data, height, scaleX, scaleY }) {
  return (
    <>
      {data.map(({ hour, count }) => (
        <rect
          key={`bar-${hour}`}
          x={scaleX(hour)}
          y={scaleY(count)}
          width={scaleX.bandwidth()}
          height={height - scaleY(count)}
          fill="#9a6fb0"
        />
      ))}
    </>
  );
}

function ByDate({ data }) {

  const ByDate = data.reduce((group, product) => {
    let d = new Date(product["timestamp"]);
    d = Math.floor(d.getDate());
    group[d] = group[d] ?? [];
    group[d].push(product);
    return group;
  }, {});

  const CountDates = Object.entries(ByDate).map(([groupname, value]) => ({
    hour: +groupname,
    count: value.length,
  }));


  const margin = { top: 10, right: 5, bottom: 25, left: 40 },
    width = 550 - margin.right - margin.left,
    height = 90 - margin.top - margin.bottom;

  const xScale = d3
    .scaleBand()
    .domain(CountDates.map(({ hour }) => hour))
    .range([0, width])
    .padding(0.3);
  const yScale = d3
    .scaleLinear()
    .domain([
      (Math.min(...CountDates.map(({ count }) => count))-100),
      Math.max(...CountDates.map(({ count }) => count)),
    ])
    .range([height, 0]);

  const ticks = xScale.domain().filter((e,i)=>i%10==0);



  return (
    <>
      {CountDates[0] && (
        <div className="charts">
          <svg
            width={width + margin.left + margin.right}
            height={height + margin.top + margin.bottom}
          >
            <g transform={`translate(${margin.left}, ${margin.top})`}>
              <AxisBottom
                scale={xScale}
                transform={`translate(0, ${height})`}
                ticks={ticks}
              />
              <AxisLeft scale={yScale} />
              <Bars
                data={CountDates}
                height={height}
                scaleX={xScale}
                scaleY={yScale}
              />
            </g>
          </svg>
        </div>
      )}
    </>
  );
}

export default ByDate;