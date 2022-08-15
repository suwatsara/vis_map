import React from "react";
import App from './app'
import ReactDOM from "react-dom";
import './index.css'
import { HashRouter, Routes, Route } from 'react-router-dom';
import About from './components/pages/About';
import GeometryEditor from './components/pages/GeometryEditor'

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


