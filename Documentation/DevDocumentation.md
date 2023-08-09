# Development Documentation

In the following I will try to explain to new developers whats needed to start working on this project. First I will show how to install dependencies, then show the steps to start the development enviroment. I would recommend only using electron when you want to just see how it works, while developing using the npm webserver as it automatically updates on save.
## Backend *(picpurge.py)*
### Usage

The script can be executed by calling the `init()` function and passing the required arguments:

```python
init(folder_path, agro_threshold, keep_non_media)
```

- `folder_path` (str): Path to the folder containing the images. The script will traverse the folder and its subdirectories to find images.
- `agro_threshold` (int): Aggressiveness threshold for duplicate image comparison. It should be a value between 0 and 5, where a higher value indicates a stricter comparison.
- `keep_non_media` (bool): Flag to determine whether to keep or remove non-media files (files with extensions other than supported image and video formats). Set it to `True` to keep non-media files and `False` to remove them.

### Dependencies

The script relies on the following Python libraries:

- `imagehash`: Used for calculating the perceptual hash of images and comparing them.
- `PIL` (Python Imaging Library): Required for image processing and opening images.
- `tqdm`: Used for displaying a progress bar during the image comparison process.

Make sure to install these dependencies before running the script using the following command:

```bash
pip install imagehash Pillow tqdm
```

### Supported File Formats

The script supports the following image and video file formats for comparison:

- Image formats: `.jpg`, `.jpeg`, `.png`, `.gif`, `.bmp`
- Video formats: `.mp4`, `.avi`, `.mkv`, `.mov`

### Processing Workflow

The script follows the following workflow:

1. Calculate the total number of comparisons needed based on the number of images in the specified folder.
2. Create a separate folder named "Duplicate-Images" within the provided folder path to store duplicate images.
3. Traverse the folder and its subdirectories to collect the paths of all image files.
4. Split the image paths into batches to process a certain number of images at a time.
5. Process the image batches in parallel using multithreading.
6. For each pair of images in a batch:
   - Check if the file extensions of the images are supported image or video formats. If not, optionally remove the non-media file based on the `keep_non_media` flag.
   - Compare the images using imagehash and the specified aggressiveness threshold.
   - If the images are determined to be duplicates, move the second image to the "Duplicate-Images" folder.
7. Update the progress bar to reflect the progress of the image comparison process.
8. Upon completion, close the progress bar.

### Example Usage

```python
from image_purge import init

folder_path = "/path/to/images"
agro_threshold = 3
keep_non_media = False

init(folder_path, agro_threshold, keep_non_media)
```

In this example, the script will compare and remove duplicate images in the specified folder (`folder_path`) with an aggressiveness threshold of `3`. Non-media files will be removed (`keep_non_media = False`).
## Backend *(api.py)*

### Installation

1. Make sure you have Python installed on your system.
2. Install the required dependencies by running the following command:

   ```bash
   pip install flask flask_cors
   ```

### Usage

1. Import the `init` function from the `picpurger` module in your Python script.
2. Initialize a Flask application and enable CORS (Cross-Origin Resource Sharing).
3. Define a route to handle the API request with the required parameters.
4. Decode the `file_path` parameter using `urllib.parse.unquote`.
5. Call the `init` function, passing the decoded `file_path`, `agro`, and `keep_non_media` parameters.
6. Return a response indicating the completion of the process.

### API Endpoint

The API provides a single endpoint:

#### Run Image Purge

- Method: `GET`
- Route: `/picAPI/run/<path:file_path>/<agro>/<keep_non_media>`
- Parameters:
  - `file_path` (string): The path to the folder containing the images. It should be URL-encoded to handle special characters and spaces.
  - `agro` (integer): The aggressiveness threshold for duplicate image comparison. It should be an integer value between 0 and 5.
  - `keep_non_media` (boolean): Determines whether to keep or remove non-media files. It should be a boolean value (`true` or `false`).
- Response: Returns a JSON response indicating the completion of the process.

### Example Usage

```python
import urllib.parse
from flask import Flask
from flask_cors import CORS
from picpurger import init

app = Flask(__name__)
CORS(app)

@app.route("/picAPI/run/<path:file_path>/<agro>/<keep_non_media>", methods=["GET"])
def run(file_path, agro, keep_non_media):
    decoded_file_path = "/" + urllib.parse.unquote(file_path)
    init(decoded_file_path, int(agro), bool(keep_non_media))
    return {"finished": f"{decoded_file_path}"}

if __name__ == "__main__":
    app.run(port=5002)
```

In this example, the Flask application is created with CORS enabled. The `/picAPI/run` endpoint is defined to handle the GET request with the required parameters: `file_path`, `agro`, and `keep_non_media`. The `file_path` parameter is URL-decoded using `urllib.parse.unquote`. The `init` function is called with the decoded parameters, and a JSON response is returned indicating the completion of the process. The API runs on port 5002 by default.

## Frontend *(Installing React and Electron)*

This guide will walk you through the installation process for React and Electron, two popular frameworks for building cross-platform desktop applications.

### Prerequisites

Before you begin, make sure you have the following prerequisites installed on your system:

- Node.js (version 12 or higher): You can download and install Node.js from the official website: [https://nodejs.org](https://nodejs.org)

- Electron

    1. Install the Electron package by running the following command:

        ```bash
        npm install electron -g
        ```
- radix-ui

    2. Install the radix-ui packages by running the following commands:

        ```terminal
        npm install @radix-ui/react-switch
        npm install @radix-ui/react-progress
        ```

# Starting The Development Enviroment
### Start The API
1. Change into the PicPurge/backend directory
2. Run:
    ```bash
    python api.py
    ```
### Start The WebServer
3. Change into the PicPurge/frontend/Picpurge directory
4. Run:
    ```bash
    npm run dev
    ```
- You can access the webpage from the link provided in the terminal
### Test With Electron
5. Change into the root direcotry of the project
6. Run:
    ```bash
    electron electron/
    ```

___
Hopefully this was enough to allow you to begin working on this project. 