import React, { useState } from "react";
import "./Panel.css";
import * as d3 from "d3";
const formatDate = d3.timeFormat("%B %d, %Y");

function Panel({ data, selected, activeLayer }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOnClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={activeLayer === 3 ? "PanelContainer-top" : "PanelContainer"}
    >
      <div className="Title">
        {data[0] && (
          <div className="panel_title">{formatDate(data[0].timestamp)}</div>
        )}
        <button onClick={handleOnClick} className="PanelExpander">
          i
        </button>
        {/* <div className='PanelExpander'>✕</div> */}
      </div>
      {isOpen && (
        <>
          <div className="PanelContent">
            <div className={activeLayer === 3 ? "none" : "stat"}>
              Total Point
              <b>{data.length}</b>
              {activeLayer === 1 && (
                <>
                  <div className="gradientScale">
                    <div className="gr1" />
                    <div className="gr2" />
                    <div className="gr3" />
                    <div className="gr4" />
                    <div className="gr5" />
                  </div>
                  <div className="gradientMarkers">
                    <div className="gradientMarkerLeft">Low FRI</div>
                    <div className="gradientMarkerRight">High FRI</div>
                    <br />
                  </div>
                </>
              )}
            </div>
            {activeLayer === 3 && (
              <div className="stat">
                {" "}
                Selected area represents
                <b>{selected.length}</b>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Panel;
