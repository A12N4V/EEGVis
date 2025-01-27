import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend for saving images

from flask import Flask, jsonify, send_file
from flask_cors import CORS
import mne
import io
import numpy as np
import matplotlib.pyplot as plt  # Import pyplot for plotting
import os

# Set up the Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load MNE sample dataset
data_path = mne.datasets.sample.data_path()
subjects_dir = os.path.join(data_path, "subjects")
trans_file = os.path.join(data_path, 'MEG', 'sample', 'sample_audvis_raw-trans.fif')

# Load the sample EEG data
evoked_files = mne.read_evokeds(os.path.join(data_path, 'MEG', 'sample', 'sample_audvis-ave.fif'))
evoked = None
for e in evoked_files:
    if e.comment == "Right Auditory":
        evoked = e
        break

if evoked is None:
    raise ValueError("No evoked response found for 'Right Auditory'.")

@app.route('/api/eeg-data', methods=['GET'])
def get_eeg_data():
    try:
        # Load raw data
        raw = mne.io.read_raw_fif(os.path.join(data_path, 'MEG', 'sample', 'sample_audvis_raw.fif'), preload=True)
        raw.pick_types(eeg=True)

        # Check if we have enough EEG channels
        if raw.ch_names:
            # Crop data to 10 seconds if there are EEG channels
            raw.crop(tmin=0, tmax=10)  # Crop to the first 10 seconds
            data = raw.get_data()  # Get EEG data for selected channels
            signal_labels = raw.ch_names  # Get the selected channel names
            return jsonify({"labels": signal_labels, "data": data.tolist()})
        else:
            return jsonify({"error": "No EEG channels found in the dataset."}), 400

    except Exception as e:
        return jsonify({"error": "An unexpected error occurred: " + str(e)}), 500

@app.route('/api/eeg-heatmap/<float:time_point>', methods=['GET'])
def generate_heatmap(time_point):
    try:
        raw = mne.io.read_raw_fif(os.path.join(data_path, 'MEG', 'sample', 'sample_audvis_raw.fif'), preload=True)
        raw.pick_types(eeg=True)

        times = raw.times
        closest_time_index = (np.abs(times - time_point)).argmin()
        start_index = max(0, closest_time_index - int(1 * raw.info['sfreq']))  # 1 second before
        stop_index = min(len(times), closest_time_index + int(1 * raw.info['sfreq']))  # 1 second after
        data_at_time = raw.get_data(start=start_index, stop=stop_index).mean(axis=1)

        # Create a topographic plot with a dark background
        fig, ax = plt.subplots()
        ax.set_facecolor('black')  # Set background color to black
        mne.viz.plot_topomap(data_at_time, raw.info, axes=ax, show=False, cmap='coolwarm')  # Use coolwarm for heatmap effect
        
        # Set title and customize axes
        ax.set_title(f'Topography at {time_point:.2f} seconds', color='white')  # Change title color to white
        
        # Customize colorbar
        cbar = plt.colorbar(ax.images[0], ax=ax)
        cbar.ax.yaxis.set_tick_params(color='white')  # Set color of colorbar ticks to white
        cbar.ax.set_ylabel('Amplitude', color='white')  # Set label color to white
        cbar.outline.set_edgecolor('white')  # Set color of colorbar outline to white

        # Change tick colors to white
        ax.tick_params(axis='both', colors='white')

        img = io.BytesIO()
        plt.savefig(img, format='png', facecolor='black')  # Save with black facecolor
        img.seek(0)
        plt.close(fig)

        return send_file(img, mimetype='image/png')

    except Exception as e:
        return jsonify({"error": "An unexpected error occurred: " + str(e)}), 500
    
@app.route('/api/eeg-3d/<float:time>', methods=['GET'])
def generate_3d(time):
    try:
        return send_file('s1.png', mimetype='image/png')
    except Exception as e:
        print(f"Error occurred: {e}")  # Log any error if needed
        return send_file('s1.png', mimetype='image/png')  # Fallback to sending the image
    
if __name__ == '__main__':
    app.run(debug=True)
