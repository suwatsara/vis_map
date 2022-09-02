import React from "react";
import App from './app'
import './index.css'
import ReactDOM from "react-dom";
import About from './components/pages/About';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { RecoilRoot } from "recoil";

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
    <HashRouter>
      {/* <Header /> */}
      <Routes>
        <Route path="/" element={<About />}></Route>
      </Routes>

    </HashRouter>


    </RecoilRoot>

  </React.StrictMode>,
  document.getElementById("root")
)


