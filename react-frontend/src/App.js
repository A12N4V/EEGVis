import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import './App.css';


function App() {
  const [eegData, setEegData] = useState([]);
  const [heatmap, setHeatmap] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode
  const [eeg3DImage, setEeg3DImage] = useState(null);
  const [timePoint, setTimePoint] = useState(0.01); // Default time point
  const [isPlaying, setIsPlaying] = useState(false); // State for play/pause
  const [intervalId, setIntervalId] = useState(null); // To store the interval ID

  const fetchEEGData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/eeg-data');
      const { labels, data } = response.data;
      const time = Array.from({ length: data[0].length }, (_, i) => i / 100); // Adjusted for seconds

      const eegSignals = data.map((signal, index) => ({
        x: time,
        y: signal,
        mode: 'lines',
        name: labels[index]
      }));
      setEegData(eegSignals);

      // Fetch heatmap for the default time point
      fetchHeatmap(timePoint);

      // Fetch 3D EEG image (s1.png)
      const eeg3DResponse = await axios.get('http://127.0.0.1:5000/api/eeg-3d/0.1', { responseType: 'blob' });
      const eeg3DUrl = URL.createObjectURL(eeg3DResponse.data);
      setEeg3DImage(eeg3DUrl);
    } catch (error) {
      console.error('Error fetching EEG data:', error);
    }
  };

  const fetchHeatmap = async (time) => {
    try {
      const heatmapResponse = await axios.get(`http://127.0.0.1:5000/api/eeg-heatmap/${time}`, { responseType: 'blob' });
      const heatmapUrl = URL.createObjectURL(heatmapResponse.data);
      setHeatmap(heatmapUrl);
    } catch (error) {
      console.error('Error fetching heatmap:', error);
    }
  };

  const handlePlotClick = (data) => {
    const clickedTime = data.points[0].x; // Get the time of the clicked point
    setTimePoint(clickedTime);
    fetchHeatmap(clickedTime); // Fetch the heatmap for the clicked time point
  };

  useEffect(() => {
    fetchEEGData();
  }, []);

  useEffect(() => {
    let interval = null;

    if (isPlaying) {
      // Set an interval to fetch heatmap data every second
      interval = setInterval(() => {
        setTimePoint((prevTime) => {
          const newTime = prevTime + 1; // Increment time by 1 second
          fetchHeatmap(newTime);
          return newTime;
        });
      }, 400); // 1000 ms = 1 second
      setIntervalId(interval);
    } else if (!isPlaying && intervalId) {
      clearInterval(intervalId);
    }

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [isPlaying]);

  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className={`App ${isDarkMode ? 'dark' : 'light'}`}>
      <header>
        <h1>Encephalic</h1>
        <button className="toggle-button" onClick={handleToggleTheme}>
          <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
        </button>
      </header>

      <div className="content">
        {/* Left Pane: EEG Plot */}
        <div className="left-pane">
          {eegData.length > 0 && (
            <Plot
              data={eegData}
              layout={{
                title: '',
                xaxis: { title: 'Time (s)' },
                yaxis: { title: 'Amplitude (µV)' },
                paper_bgcolor: isDarkMode ? 'black' : '#ffffff',
                plot_bgcolor: isDarkMode ? 'black' : '#ffffff',
                font: { color: isDarkMode ? '#ffffff' : '#000000' }
              }}
              onClick={handlePlotClick} // Add onClick event
              className="plot-container"
              style={{ width: '100%', height: '100%' }} // Full width and height
            />
          )}
        </div>

        {/* Right Pane: EEG Maps */}
        <div className="right-pane">
          {/* EEG Heatmap */}
          {heatmap && (
            <div className="map-item">
              <img src={heatmap} alt="EEG Heatmap" className="map-image" id="topograph"/>
            </div>
          )}

          {/* EEG 3D Image */}
          {eeg3DImage && (
            <div className="map-item">
              <img src={eeg3DImage} alt="EEG 3D Image" className="map-image" id="3d-map"/>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
