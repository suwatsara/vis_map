import React, { useState, useMemo, useEffect } from 'react';
import DeckGL from '@deck.gl/react';
import './About.css'


function Heatmap({ data }) {
  const newdata = data.map((row) => ({
    timestamp: new Date(row.timestamp).getTime(),
    latitude: row.latitude,
    longitude: row.longitude,
    value: 1
  }));



console.log(newdata)



  return (
    <div>

    </div>


  )


}

export default Heatmap;

