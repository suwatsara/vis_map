import React, { useState, useLayoutEffect, useRef, useMemo } from "react";
import * as d3 from "d3";
import "./Chart.css";

const formatMinute = d3.timeFormat("%H");

function AxisBottom({ scale, transform }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    if (ref.current) {
      d3.select(ref.current).call(
        d3.axisBottom(scale).tickFormat(formatMinute)
      );
    }
  }, [scale]);

  return <g ref={ref} transform={transform} />;
}

function AxisLeft({ scale }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    if (ref.current) {
      d3.select(ref.current).call(d3.axisLeft(scale));
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

function Chart({ data }) {
  const newdata = data.map((row) => ({
    timestamp: new Date(row.timestamp).getTime(),
    latitude: row.latitude,
    longitude: row.longitude,
  }));

  const DataTime = newdata.reduce((group, product) => {
    let d = new Date(product["timestamp"]);
    d = Math.floor(d.getTime() / (1000 * 60 * 60));
    group[d] = group[d] ?? [];
    group[d].push(product);
    return group;
  }, {});

  const CountHours = Object.entries(DataTime).map(([groupname, value]) => ({
    hour: +groupname * 1000 * 60 * 60,
    count: value.length,
  }));

  const formatDay = d3.timeFormat("%B %d, %Y");

  const margin = { top: 10, right: 5, bottom: 25, left: 60 },
    width = 500 - margin.right - margin.left,
    height = 110 - margin.top - margin.bottom;

  const xScale = d3
    .scaleBand()
    .domain(CountHours.map(({ hour }) => hour))
    .range([0, width])
    .padding(0.3);
  const yScale = d3
    .scaleLinear()
    .domain([0, Math.max(...CountHours.map(({ count }) => count))])
    .range([height, 0]);

  return (
    <>
      {CountHours[0] && (
        <div className="charts">
          {CountHours[0] && (<h4>Date: {formatDay(CountHours[0].hour)}</h4>)}
          <svg
            width={width + margin.left + margin.right}
            height={height + margin.top + margin.bottom}
          >
            <g transform={`translate(${margin.left}, ${margin.top})`}>
              <AxisBottom
                scale={xScale}
                transform={`translate(0, ${height})`}
              />
              <AxisLeft scale={yScale} />
              <Bars
                data={CountHours}
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

export default Chart;
