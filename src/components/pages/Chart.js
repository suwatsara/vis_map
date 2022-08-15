import React, { useState, useLayoutEffect, useRef, useMemo } from 'react'
import * as d3 from "d3";
import './Chart.css'

const margin = { top: 10, right: 20, bottom: 30, left: 60 },
    width = 500,
    height = 175;


function Chart({ data }) {


    const newdata = data.map(row => ({
        timestamp: new Date(row.timestamp).getTime(),
        latitude: row.latitude,
        longitude: row.longitude,
    }));


    const DataTime = newdata.reduce((group, product) => {
        let d = new Date(product['timestamp']);
        d = Math.floor(d.getTime() / (1000 * 60 * 60));
        group[d] = group[d] ?? [];
        group[d].push(product);
        return group;
    }, {});

    const formatMinute = d3.timeFormat("%H:%M"),
          formatDay = d3.timeFormat("%B %d, %Y" ),
          formatHour = d3.timeFormat("%I %p");

    // Define filter conditions
    function multiFormat(date) {
        return (d3.timeHour(date) < date ? formatMinute : d3.timeDay(date) < date && formatHour)(date);
    }

    // (d3.timeHour(date) < date ? formatMinute : d3.timeDay(date) < date && formatHour)(date);

    const CountHours = Object
        .entries(DataTime)
        .map(([groupname, value]) =>
        ({
            hour: ((+groupname) * 1000 * 60 * 60),
            count: value.length
        }))
    const axesRef = useRef(null);
    const boundsWidth = width - margin.right - margin.left;
    const boundsHeight = height - margin.top - margin.bottom;

    const [min, max] = d3.extent(CountHours, (d) => d.count);
    const yScale = useMemo(() => {
        return d3
            .scaleLinear()
            .domain([0, max || 0])
            .range([boundsHeight, 0]);
    }, [CountHours, height]);


    // X axis
    const [xMin, xMax] = d3.extent(CountHours, (d) => d.hour);
    const xScale = useMemo(() => {
        return d3
            .scaleLinear()
            .domain([xMin || 0, xMax || 0])
            .range([0, boundsWidth]);
    }, [CountHours, width]);

    // Render the X and Y axis using d3.js
    useLayoutEffect(() => {
        const svgElement = d3.select(axesRef.current);
        svgElement.selectAll("*").remove();
        const xAxisGenerator = d3.axisBottom(xScale).tickFormat(multiFormat);
        svgElement
            .append("g")
            .attr("transform", "translate(0," + boundsHeight + ")")
            .call(xAxisGenerator);

        const yAxisGenerator = d3.axisLeft(yScale);
        svgElement.append("g").call(yAxisGenerator);
    }, [xScale, yScale, boundsHeight]);

    const areaBuilder = d3
        .area()
        .x((d) => xScale(d.hour))
        .y1((d) => yScale(d.count))
        .y0(yScale(0));
    const areaPath = areaBuilder(CountHours);

    // Build the line
    const lineBuilder = d3
        .line()
        .x((d) => xScale(d.hour))
        .y((d) => yScale(d.count));
    const linePath = lineBuilder(CountHours);

    if (!linePath || !areaPath) {
        return null;
    }

    return (

        <div className='charts'>
            <h4>Date: {formatDay(CountHours[0].hour)}</h4>
            <svg width={500} height={175}>
                <g
                    width={boundsWidth}
                    height={boundsHeight}
                    transform={`translate(${[margin.left, margin.top].join(",")})`}
                >
                    <path
                        d={areaPath}
                        opacity={1}
                        stroke="none"
                        fill="#9a6fb0"
                        fillOpacity={0.4}
                    />
                    <path
                        d={linePath}
                        opacity={1}
                        stroke="#9a6fb0"
                        fill="none"
                        strokeWidth={2}
                    />
                </g>
                <g
                    width={boundsWidth}
                    height={boundsHeight}
                    ref={axesRef}
                    transform={`translate(${[margin.left, margin.top].join(",")})`}
                />
            </svg>

        </div>



    )
}

export default Chart