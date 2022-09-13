import React, { useState } from "react";
import "./Panel.css";
import * as d3 from "d3";
const formatDate = d3.timeFormat("%B %d, %Y");

function InfoPanel(props) {
  const { data, selected, layerVisibility, min, max } = props;
  const [isOpen, setIsOpen] = useState(true);

  const handleOnClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="PanelContainer">
      <div className="Title">
        {data[0] && (
          <div className="panel_title">{formatDate(data[0].timestamp)}</div>
        )}
        <button onClick={handleOnClick} className="PanelExpander">
          i
        </button>
      </div>
      {isOpen && (
        <>
          <div className="PanelContent">
            <div className={layerVisibility.scatter ? "none" : "stat"}>
              Total Point
              <b>{data.length}</b>
              <div className="gradientScale">
                <div className="gr1" />
                <div className="gr2" />
                <div className="gr3" />
                <div className="gr4" />
                <div className="gr5" />
                <div className="gr6" />
              </div>
              {!layerVisibility.scatter && (
                <>
                  <div className="gradientMarkers">
                    {layerVisibility.heatmap ? (
                      <>
                        <div className="gradientMarkerLeft">Fewer</div>
                        <div className="gradientMarkerRight">More</div>
                      </>
                    ) : (
                      <>
                        <div className="gradientMarkerLeft">min: {min}</div>
                        <div className="gradientMarkerRight">max: {max}</div>
                      </>
                    )}

                    <br />
                  </div>
                </>
              )}
            </div>
            {layerVisibility.scatter && (
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

export default InfoPanel;
