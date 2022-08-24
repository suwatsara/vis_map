import React, { useRef, useMemo, useEffect } from "react";
import DeckGL from "@deck.gl/react";
import "./Chart.css";
import * as d3 from "d3";

const MARGIN = { top: 30, right: 30, bottom: 50, left: 50 };

function Heatmap({ data, width, height }) {

  const axesRef = useRef(null);
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const yScale = useMemo(() => {
    const [min, max] = d3.extent(data.map((d) => d.latitude));
    return d3.scaleLinear().domain([min, max]).range([boundsHeight, 0]);
  }, [data, height]);


  const xScale = useMemo(() => {
    const [min, max] = d3.extent(data.map((d) => d.longitude));
    return d3.scaleLinear().domain([min, max]).range([0, boundsWidth]);
  }, [data, width]);

  useEffect(() => {
    const svgElement = d3.select(axesRef.current);
    svgElement.selectAll("*").remove();
    const xAxisGenerator = d3.axisBottom(xScale);
    svgElement
      .append("g")
      .attr("transform", "translate(0," + boundsHeight + ")")
      .call(xAxisGenerator);

    const yAxisGenerator = d3.axisLeft(yScale);
    svgElement.append("g").call(yAxisGenerator);
  }, [xScale, yScale, boundsHeight]);


  const allShapes = data.map((d, i) => {
    return (
      <circle
        key={i}
        r={4}
        cx={xScale(d.longitude)}
        cy={yScale(d.latitude)}
        opacity={1}
        stroke="#9a6fb0"
        fill="#9a6fb0"
        fillOpacity={0.7}
        strokeWidth={1}
      />
    );
  });


  

  return (
    <div className="charts">
       <svg
        width={width}
        height={height}
        style={{ display: "inline-block", background: "white" }}
      >
        {/* first group is for the violin and box shapes */}
        <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
        >
          {allShapes}
        </g>
        {/* Second is for the axes */}
        <g
          width={boundsWidth}
          height={boundsHeight}
          ref={axesRef}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
        />
      </svg>
     
    </div>
  );
}

export default Heatmap;
