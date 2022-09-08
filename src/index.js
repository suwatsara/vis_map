import React from "react";
import App from './app'
import './index.css'
import ReactDOM from "react-dom";
import ControlPanel from "./components/ControlPanel/ControlPanel";
import { HashRouter, Routes, Route } from 'react-router-dom';
import { RecoilRoot } from "recoil";

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
    <HashRouter>
      {/* <Header /> */}
      <Routes>
        <Route path="/" element={<App />}></Route>
      </Routes>

    </HashRouter>


    </RecoilRoot>

  </React.StrictMode>,
  document.getElementById("root")
)


