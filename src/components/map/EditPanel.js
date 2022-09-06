import React, { useState } from "react";
import CropDinIcon from "@mui/icons-material/CropDin";
import PolylineIcon from "@mui/icons-material/Polyline";
import EditIcon from "@mui/icons-material/Edit";

function EditPanel({ setMode }) {
  return (
    <>
      <div className="wrapper">
        <button
          className="button"
          type="button"
          title="rectangle"
          onClick={() => setMode("rectangle")}
        >
          <CropDinIcon />
        </button>
        <button
          className="button"
          type="button"
          title="polyline"
          onClick={() => setMode("polygon")}
        >
          <PolylineIcon />
        </button>
        <button
          className="button"
          type="button"
          title="cancel"
          onClick={() => setMode(null)}
        >
          <EditIcon />
        </button>
      </div>
    </>
  );
}

export default EditPanel;
