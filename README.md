# EEG Visualizer

<div align="center">
  <img src="s3.png" alt="EEG Graph" width="30%" style="display:inline-block;" />
  <img src="s1.png" alt="Heatmap" width="30%" style="display:inline-block;" />
  <img src="s2.png" alt="3D Brain Map" width="30%" style="display:inline-block;" />
</div>

An EEG Visualizer web application designed to process, display, and analyze EEG data. This tool provides an intuitive interface to plot EEG signals, visualize heatmaps, and explore a 3D brain map. The frontend is built with React, and the backend is powered by Flask. 

---

## Features

- **EEG Graph Plotting**: Visualize EEG data in real time using interactive graphs.
- **Heatmap Display**: View heatmaps that represent brain activity across various regions.
- **3D Brain Map**: Explore a 3D model of the brain to understand data in a spatial context.
- **Backend Processing**: Leverages [MNE-Python](https://mne.tools/) for advanced EEG data analysis and preprocessing.

---

## Installation

Follow the steps below to set up and run the EEG Visualizer on your local machine.

### Prerequisites

- **Python** (>=3.8)
- **Node.js** (>=14.x)
- **npm** or **yarn**

### Backend Setup (Flask)

1. Clone the repository:
    ```bash
    git clone https://github.com/A12N4V/EEGVis.git
    cd EEGVis/backend
    ```

2. Create a virtual environment:
    ```bash
    python -m venv venv
    source venv/bin/activate   # On Windows: venv\Scripts\activate
    ```

3. Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4. Run the Flask server:
    ```bash
    flask run
    ```

The Flask server will run on `http://127.0.0.1:5000` by default.

### Frontend Setup (React)

1. Navigate to the frontend folder:
    ```bash
    cd ../frontend
    ```

2. Install dependencies:
    ```bash
    npm install   # or yarn install
    ```

3. Start the React development server:
    ```bash
    npm start   # or yarn start
    ```

The React app will run on `http://localhost:3000` by default.

---

## Project Structure

```
├── backend
│   ├── app.py                # Flask application entry point
│   ├── routes.py             # Backend API routes
│   ├── utils
│   │   └── eeg_processing.py # EEG data processing with MNE-Python
│   └── requirements.txt      # Backend dependencies
├── frontend
│   ├── src
│   │   ├── components
│   │   │   ├── EEGGraph.js    # EEG plotting component
│   │   │   ├── Heatmap.js     # Heatmap display component
│   │   │   └── BrainMap3D.js  # 3D brain visualization component
│   │   └── App.js            # Main React entry point
│   └── package.json          # Frontend dependencies
└── README.md                 # Project documentation
```

---

## Usage

1. Upload EEG data via the web interface or load sample datasets.
2. Use the EEG graph to explore signal patterns.
3. Analyze brain activity using the heatmap and 3D brain map.

---

## Technologies Used

- **Frontend**: React (with modern hooks and state management)
- **Backend**: Flask
- **EEG Data Processing**: MNE-Python
- **Graphing & Visualization**: Plotly.js (frontend), matplotlib (backend)

---

## Example Initialization Code

### Backend (Flask)
Here’s a snippet to initialize the Flask app:

```python
from flask import Flask
from routes import init_routes

app = Flask(__name__)
init_routes(app)

if __name__ == "__main__":
    app.run(debug=True)
```

### Frontend (React)
Example of a React component for EEG graph visualization:

```jsx
import React from 'react';
import Plot from 'react-plotly.js';

const EEGGraph = ({ data }) => {
  return (
    <Plot
      data={data}
      layout={{
        title: 'EEG Signal',
        xaxis: { title: 'Time (s)' },
        yaxis: { title: 'Amplitude (μV)' },
      }}
    />
  );
};

export default EEGGraph;
```

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`feature/your-feature-name`).
3. Commit your changes and push to your branch.
4. Submit a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contact

For questions or feedback, feel free to reach out via GitHub Issues or contact the maintainer through the repository: [A12N4V/EEGVis](https://github.com/A12N4V/EEGVis).

