// EEGPlot.js
import React from 'react';
import Plot from 'react-plotly.js';

function EEGPlot({ eegData, isDarkMode }) {
  return (
    <div className="plot-container">
      {eegData.length > 0 && (
        <Plot
          data={eegData}
          layout={{
            title: 'EEG Signal',
            xaxis: { title: 'Time' },
            yaxis: { title: 'Amplitude (µV)' },
            paper_bgcolor: isDarkMode ? 'black' : '#ffffff',
            plot_bgcolor: isDarkMode ? 'black' : '#ffffff',
            font: { color: isDarkMode ? '#ffffff' : '#000000' }
          }}
          style={{ width: "90%", height: "90%" }}
        />
      )}
    </div>
  );
}

export default EEGPlot;
