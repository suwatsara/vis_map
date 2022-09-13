import React, { useState, useRef } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import Papa from "papaparse";
import "../ControlPanel/ControlPanel.css";
import { styled, withStyles } from '@mui/styles';

function UploadFile() {
  const ProcessButton = styled(LoadingButton)({
    "&.MuiLoadingButton-root": {
      backgroundColor: "#9a6fb0;",
      color: "white",
      fontWeight: 500,
      textTransform: "capitalize",
      border: "none",
      "&:hover": {
        backgroundColor: "#9a6fb0",
      },
    },
  });

  const [file, setFile] = useState("");
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buttonloading, setButtonLoading] = useState(false);
  const [isUpload, setIsUpload] = useState(true);
  const [isShow, setIsShow] = useState(false);

  const handleOnClick = () => {
    setIsShow(!isShow);
  };

  const inputRef = useRef(null);

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
      worker: true,
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

  console.log(list);

  return (
    <div className="ControlPanel">
      {file && <h3>Current File: {file.name}</h3>}
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
                    variant="outlined"
                  >
                    Process
                  </ProcessButton>
                </div>
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default UploadFile;
