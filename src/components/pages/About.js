import React, { useState, useRef } from "react";
import Papa from "papaparse";
import LoadingButton from "@mui/lab/LoadingButton";
import "./About.css";
import Cluster from "./Cluster";
import ShowTable from "./Table";
import Modal from "react-modal";
import GeometryEditor from "./GeometryEditor";

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
  const [isShow, setIsShow] = useState(true);
  const [isShowData, setIsShowData] = useState(false);

  const handleOnClick = () => {
    setIsShow(!isShow);
  };

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
    // const speed = list.find((el) => el.name === "speed");

    // convert to number
    const newLat = lat && lat.values.map((d) => Number(d));
    const newLng = lng && lng.values.map((d) => Number(d));
    // const newspeed = speed && speed.values.map((d) => Number(d));
    const newTime =
      time && time.values.map((d) => new Date(Number(d) * 1000).getTime());

    setSelected({
      Lng: newLng,
      Lat: newLat,
      TimeStamp: newTime,
      // Speed: newspeed
    });

    setIsUpload(false);
    setIsShowData(true);
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
    // speed
  }));

  const lat_result = list.find(
    ({ name }) => ((name === "lat") ||( name === "latitude") || (name === "Latitude") || (name === "Lat"))
  );
  let lat_res = list.some(
    (code) => ((code.name ===  "lat") ||( code.name === "latitude") || (code.name === "Latitude") || (code.name === "Lat"))
  );

  const lat = lat_result && lat_result.name;

  const lng_result = list.find(
    ({ name }) =>
       ((name ==="lng") || (name ==="longitude") || (name ==="Longitude") || (name ==="Lng") || (name ==="Long"))
  );
  let lng_res = list.some(
    (code) =>
       ((code.name ==="lng") || (code.name ==="longitude") || (code.name ==="Longitude") || (code.name ==="Lng") || (code.name ==="Long"))
  );

  const lng = lng_result && lng_result.name;

  return (
    <div>
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
                    APPLY
                  </button>
                  {isShowData && (
                    <button
                      className="ShowData"
                      title="Show Data"
                      type="button"
                      onClick={openModal}
                    >
                      Show Data Table
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
