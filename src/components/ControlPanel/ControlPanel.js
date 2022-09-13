import React, { useState, useRef, useCallback } from "react";
import Papa from "papaparse";
import LoadingButton from "@mui/lab/LoadingButton";
import "./ControlPanel.css";
import ShowTable from "../ControlPanel/Table";
import Modal from "react-modal";
import { FlyToInterpolator } from "deck.gl";
import { viewportState } from "../../utils";
import { useRecoilState } from "recoil";
import Layers from "../MapComponent/Layers";
import { styled, withStyles } from '@mui/styles';

const customStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    zIndex: 2,
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    height: "80%",
  },
};

const ProcessButton = styled(LoadingButton)({

  '&.MuiLoadingButton-root':{
    backgroundColor: "#9a6fb0;",
    color: "white",
    fontWeight: 500,
    textTransform:'capitalize',
    border: "none",
    '&:hover': {
      backgroundColor: "#9a6fb0",
  },
  '&.MuiLoadingButton-outlined':{
    color: 'white',
  }
}


})

Modal.setAppElement(document.getElementById("root"));

function ControlPanel() {
  const [file, setFile] = useState("");
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buttonloading, setButtonLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isUpload, setIsUpload] = useState(true);
  const [isShow, setIsShow] = useState(false);
  const [isShowData, setIsShowData] = useState(false);
  const [viewport, setViewport] = useRecoilState(viewportState);

  const handleOnClick = () => {
    setIsShow(!isShow);
  };

  const inputRef = useRef(null);

  let subtitle;
  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = "#9a6fb0";
  }

  function closeModal() {
    setIsOpen(false);
  }
  const resetFileInput = () => {
    //reset input value
    inputRef.current.value = null;
    setList([]);
    setFile(null);
    setSelected([]);
    setIsShow(false);
  };

  const handleOnChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (event) => {
    setList([]);
    setSelected([]);
    setButtonLoading(true);
    event.preventDefault();

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const rowsArray = [];
        const valuesArray = [];

        // Iterating data to get column name and their values
        results.data.map((d) => {
          rowsArray.push(Object.keys(d));
          valuesArray.push(Object.values(d));
        });

        const headers = rowsArray[0];
        const refinedList = [];

        headers.forEach((header, index) => {
          // Get items from the rows at index of header..

          const values = [];

          valuesArray.forEach((row) => {
            values.push(row[index].trim());
          });

          refinedList.push({
            name: header,
            values: values,
          });
        });

        // console.log(refinedList);
        // Set state...

        setList(refinedList);
        setButtonLoading(false);
        setLoading(true);
        setIsShow(true);
      },
    });
  };

  const handleSelection = (event) => {
    event.preventDefault();
    const { x, y, z } = event.target.elements;

    const lat = list.find((el) => el.name === x.value);
    const lng = list.find((el) => el.name === y.value);
    const time = list.find((el) => el.name === z.value);

    let newTime = [];
    for (var i = 0; i < time.values.length; i++) {
      const d = Number(time.values[i]);
      if (isNaN(d)) {
        const t = new Date(time.values[i]);
        newTime.push(t.getTime());
      } else if (d > 1000000000000) {
        newTime.push(new Date(d).getTime());
      } else {
        newTime.push(new Date(d * 1000).getTime());
      }
    }

    const newLat = lat && lat.values.map((d) => Number(d));
    const newLng = lng && lng.values.map((d) => Number(d));
    // const newspeed = speed && speed.values.map((d) => Number(d));

    // const newTime =
    //   time && time.values.map((d) => new Date(Number(d) * 1000).getTime());

    for (var i = 0; i < newLat.length; i++) {
      if (isNaN(newLat[i])) {
        alert(
          "Can not read this data type (NaN) in Lattitude \nPlease check your file"
        );
        return [];
      }
    }

    for (var i = 0; i < newLng.length; i++) {
      if (isNaN(newLng[i])) {
        alert(
          "Can not read this data type (NaN) in Longitude \nPlease check your file"
        );
        return [];
      }
    }

    let copiedArray = [];
    for (var i = 0; i < newLng.length; i++) {
      copiedArray.push({
        latitude: newLat[i],
        longitude: newLng[i],
        timestamp: newTime[i],
      });
      setSelected(copiedArray);
    }

    const arrLat = newLat.reduce((a, b) => a + b, 0) / newLat.length;
    const arrLng = newLng.reduce((a, b) => a + b, 0) / newLng.length;

    const flyto = ({
      longitude: arrLng,
      latitude: arrLat,
      zoom: 10,
      maxZoom: 15,
      pitch: 5,
      transitionDuration: 2500,
      transitionInterpolator: new FlyToInterpolator(),
    });

    setViewport(flyto);


    setIsUpload(false);
    setIsShowData(true);
  };

  const lat_result = list.find(
    ({ name }) => name.includes("lat") || name.includes("Lat")
  );
  let lat_res = list.some(
    (code) => code.name.includes("lat") || code.name.includes("Lat")
  );

  const lat = lat_result && lat_result.name;

  const lng_result = list.find(
    ({ name }) =>
      name === "lng" ||
      name === "Lng" ||
      name.includes("Lon") ||
      name.includes("lon")
  );
  let lng_res = list.some(
    (code) =>
      code.name === "lng" ||
      code.name === "Lng" ||
      code.name.includes("Lon") ||
      code.name.includes("lon")
  );

  const lng = lng_result && lng_result.name;

  return (
    <>
      <div className="ControlPanel">
        {loading && (
          <button onClick={handleOnClick} className="expander">
            ✕
          </button>
        )}
        <form>
          <div className="upload">
            <div className="container">
              {isUpload && (
                <>
                  <div className="fileUploadInput">
                    <label>✨ Upload File</label>
                    <br />
                    <input
                      ref={inputRef}
                      type="file"
                      name="file"
                      accept=".csv,.xlsx,.xls,.xml"
                      onChange={handleOnChange}
                    />
                    <ProcessButton
                      onClick={handleSubmit}
                      loading={buttonloading}
                      loadingIndicator="Loading…"
                      variant='outlined'
                    >
                      Process
                    </ProcessButton>
                  </div>
                </>
              )}
              {!isUpload && (
                <>
                  {file && <h3>Current File: {file.name}</h3>}
                  <button
                    className="delete"
                    title="Remove file"
                    type="button"
                    onClick={resetFileInput}
                  >
                    Remove File
                  </button>
                  <label>✨ Upload new File</label>
                  <div className="fileUploadInput">
                    <input
                      type="file"
                      name="file"
                      ref={inputRef}
                      accept=".csv,.xlsx,.xls,.xml"
                      onChange={handleOnChange}
                    />
                    <ProcessButton
                      onClick={handleSubmit}
                      loading={buttonloading}
                      loadingIndicator="Loading…"
                      variant='outlined'
                    >
                      Process
                    </ProcessButton>
                  </div>
                </>
              )}
            </div>
          </div>
        </form>

        {isShow && (
          <>
            {loading && (
              <>
                <form className="select-form" onSubmit={handleSelection}>
                  <div className="select">
                    <label htmlFor="latitude">Latitude</label>
                    <div className="custom-select">
                      <select id="latitude" name="x">
                        {lat_res ? (
                          <option>{lat}</option>
                        ) : (
                          list.map((option) => (
                            <option key={option.name} value={option.name}>
                              {option.name}
                            </option>
                          ))
                        )}
                      </select>
                    </div>
                  </div>

                  <div className="select">
                    <label htmlFor="longitude">Longitude</label>
                    <div className="custom-select">
                      <select id="longitude" name="y">
                        {/* {list &&
                          list.map((option) => (
                            <option key={option.name} value={option.name}>
                              {option.name}
                            </option>
                          ))} */}

                        {lng_res ? (
                          <option>{lng}</option>
                        ) : (
                          list.map((option) => (
                            <option key={option.name} value={option.name}>
                              {option.name}
                            </option>
                          ))
                        )}
                      </select>
                    </div>
                  </div>
                  <div className="select">
                    <label htmlFor="Time Filter">Time</label>
                    <div className="custom-select">
                      <select name="z" id="Time Filter">
                        {list &&
                          list.map((option) => (
                            <option key={option.name} value={option.name}>
                              {option.name}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                  <button className="Apply" title="Submit" type="submit">
                    Apply
                  </button>
                  {isShowData && (
                    <button
                      className="ShowData"
                      title="Show Data"
                      type="button"
                      onClick={openModal}
                    >
                      Dataset
                    </button>
                  )}
                </form>
              </>
            )}
          </>
        )}
      </div>
      <Modal
        isOpen={isOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Data</h2>
        <button className="Modal" onClick={closeModal}>
          ✕
        </button>
        <ShowTable rows={selected} />
      </Modal>

      <div className="button-wrapper">
        <Layers data={selected} viewstate={viewport} />
        {/* <GeometryEditor data={obj} />  */}
      </div>
    </>
  );
}

export default ControlPanel;
