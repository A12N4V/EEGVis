// Maps.js
import React from 'react';

function Maps({ heatmap, eeg3DImage }) {
  return (
    <div className="maps-container">
      {heatmap && (
        <div className="map-item">
          <h2>EEG Head Heatmap</h2>
          <img src={heatmap} alt="EEG Head Heatmap" className="map-image" />
        </div>
      )}

      {eeg3DImage && (
        <div className="map-item">
          <h2>EEG 3D Image</h2>
          <img src={eeg3DImage} alt="EEG 3D Visualization" className="map-image" />
        </div>
      )}
    </div>
  );
}

export default Maps;
