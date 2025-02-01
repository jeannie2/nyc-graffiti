import { useState } from 'react';

const Controls = () => {
  const [showControls, setShowControls] = useState(true);

  const closeControls = () => {
    setShowControls(false);
  }

  if (!showControls) return null;

    return (
      <div className="control-panel">
        <button id="controls-close-button" onClick={closeControls}>X</button>
        <h2>A map showing latest records of graffiti in New York City</h2>
        <h3>Demo: click marker on Coney Island to view image gallery (source: Pixabay)</h3>
        <h3>(Data source: <a href="https://nycopendata.socrata.com/Social-Services/nyc-graffiti/8q69-4ke5/data">NYC Open Data API</a> + user-submitted data)</h3>
      </div>
    )
  }
  
  export default Controls;
  