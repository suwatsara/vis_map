import React from "react";
import App from './app'
import ReactDOM from "react-dom";
import './index.css'
import { HashRouter, Routes, Route } from 'react-router-dom';
import About from './components/pages/About';
import Clsuter from './components/pages/Cluster';
import Heatmap from './components/pages/Heatmap';
import Header from './components/Header';

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      {/* <Header /> */}
      <Routes>
        <Route path="/" element={<About />}></Route>
        {/* <Route path="/about" element={<About />}></Route> */}
        {/* <Route path="/cluster" element={<Clsuter />}></Route>
        <Route path="/heatmap" element={<Heatmap />}></Route> */}
      </Routes>

    </HashRouter>




  </React.StrictMode>,
  document.getElementById("root")
)


