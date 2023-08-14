<div style="text-align:center">
  <img src="./images/logo-no-background.png" alt="Alt text" width="400">
</div>

A Python script to find and remove duplicate images in a specified folder. The script uses image hashing to compare images and identify duplicates based on a given threshold. It provides both a command-line interface and a simple GUI for easy usage.

## GUI Usage

1. **Select Folder**: Click the "Choose" button to select the folder containing images.
2. **Detection Level**: Use the Detection Level wheel to adjust the level of sensitivity for duplicate detection.
3. **Remove Non-Media**: Check the box if you want to keep non-media files during the process.
4. **Process**: Click the "Process" button to start the duplicate image detection and removal process.

## Installation

1. Clone the repository or download the script.
2. Install the required Python libraries using the following command:

```sh
pip install Flask imagehash tqdm
```

3. Run the script using the command line or by launching the GUI.

## How It Works

- The script uses image hashing to compare images and identify duplicates based on a given threshold (agro_threshold). Images with a Hamming distance less than or equal to the threshold are considered duplicates.
- Duplicate images will be moved to a "Duplicate-Images" folder within the original folder.
- Media files with extensions `.jpg`, `.jpeg`, `.png`, `.gif`, `.bmp`, `.mp4`, `.avi`, `.mkv`, and `.mov` will be considered for comparison. Non-media files can be removed using the "Remove Non-Media" option.

Feel free to provide feedback or report any issues.