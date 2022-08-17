import React, { useState, useRef } from "react";
import Papa from "papaparse";
import LoadingButton from "@mui/lab/LoadingButton";
import "./About.css";
import Cluster from "./Cluster";
import ShowTable from "./Table";
import Chart from "./Chart";
import Modal from "react-modal";
import GeometryEditor from "./GeometryEditor";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    zIndex: 3,
    width: "500px",
    height: "500px",
  },
};

Modal.setAppElement(document.getElementById("root"));

function About() {
  const [file, setFile] = useState("");
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState([
    { Lng: {}, Lat: {}, TimeStamp: {} },
  ]);
  const [loading, setLoading] = useState(false);
  const [buttonloading, setButtonLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isUpload, setIsUpload] = useState(true);
  const [select, setSelect] = useState("");
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

  const handleOnChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (event) => {
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
      },
    });
  };

  const handleSelection = (event) => {
    event.preventDefault();
    const { x, y, z } = event.target.elements;
    // Find selected item...
    const lat = list.find((el) => el.name === x.value);
    const lng = list.find((el) => el.name === y.value);
    const time = list.find((el) => el.name === z.value);

    // convert to number
    const newLat = lat && lat.values.map((d) => Number(d));
    const newLng = lng && lng.values.map((d) => Number(d));
    const newTime =
      time && time.values.map((d) => new Date(Number(d) * 1000).getTime());

    setSelected({
      Lng: newLng,
      Lat: newLat,
      TimeStamp: newTime,
    });
    setIsUpload(false);
  };
  // select only values
  const values = Object.values(selected);

  var arr = [];

  // Map each value from
  // {Lat: [array], Lng: [array], TimeStamp: [array]} -> [[Lng, Lat, TimeStamp]]
  for (var i = 0; i < values[0].length; i++) {
    const col0 = values.map((d) => d[i]);
    arr.push(col0);
  }

  // [[Lng, Lat, TimeStamp]] -> {[{longitude: , latitude: , timestamp: }]}
  const obj = arr.map(([longitude, latitude, timestamp]) => ({
    longitude,
    latitude,
    timestamp,
  }));

  return (
    <div>
      <div className="ControlPanel">
        <form>
          <div className="upload">
            <div className="container">
              {isUpload && (
                <>
                  <label>✨ Upload File</label>
                  <div className="fileUploadInput">
                    <input
                      type="file"
                      name="file"
                      accept=".csv,.xlsx,.xls,.xml"
                      onChange={handleOnChange}
                    />
                    <LoadingButton
                      onClick={handleSubmit}
                      loading={buttonloading}
                      loadingIndicator="Loading…"
                      variant="outlined"
                    >
                      Process
                    </LoadingButton>
                  </div>
                </>
              )}
              {!isUpload && (
                <>
                  <h3>Current File: {file.name}</h3>
                  <label>✨ Upload new File</label>
                  <div className="fileUploadInput">
                    <input
                      type="file"
                      name="file"
                      accept=".csv,.xlsx,.xls,.xml"
                      onChange={handleOnChange}
                    />
                    <LoadingButton
                      onClick={handleSubmit}
                      loading={buttonloading}
                      loadingIndicator="Loading…"
                      variant="outlined"
                    >
                      Process
                    </LoadingButton>
                  </div>
                </>
              )}
            </div>
          </div>
        </form>
        {loading && (
          <>
            <form className="select-form" onSubmit={handleSelection}>
              <div className="select">
                <label htmlFor="latitude">Latitude</label>
                <div className="custom-select">
                  <select id="latitude" name="x">
                    {list &&
                      list.map((option) => (
                        <option key={option.name} value={option.name}>
                          {option.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="select">
                <label htmlFor="longitude">Longitude</label>
                <div className="custom-select">
                  <select id="longitude" name="y">
                    {list &&
                      list.map((option) => (
                        <option key={option.name} value={option.name}>
                          {option.name}
                        </option>
                      ))}
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
              <button className="Apply" type="submit">
                APPLY
              </button>
              <button className="Apply" onClick={openModal}>
                Show Data Table
              </button>
            </form>
          </>
        )}
      </div>

      <Modal
        isOpen={isOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Data</h2>
        <button className="Modal" onClick={closeModal}>
          close
        </button>
        <ShowTable rows={obj} />
      </Modal>

      <div className="button-wrapper">
        <Cluster data={obj} />
        {/* <GeometryEditor data={obj} />  */}
      </div>
    </div>
  );
}

export default About;
