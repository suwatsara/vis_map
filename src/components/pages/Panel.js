import React from "react";
import "./Panel.css";
import * as d3 from "d3";
const formatDate = d3.timeFormat("%B %d, %Y");

function Panel({ data, selected, activeLayer}) {
  return (
    <div className={activeLayer === 3 ? "PanelContainer-top" : "PanelContainer"}>
      <div className="Title">
        {data[0] && <div>{formatDate(data[0].timestamp)}</div>}
        <div className="PanelExpander">i</div>
        {/* <div className='PanelExpander'>✕</div> */}
      </div>
      <div className="PanelContent">
        <div className={activeLayer === 3 ? "none" : "stat"}>
          Number of points
          <b>{data.length}</b>
        </div>
        {activeLayer === 3 && <div className="stat"> Selected area represents 
        <b>{selected.length}</b></div>}
      </div>
    </div>
  );
}

export default Panel;
