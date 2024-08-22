# Development Documentation

This guide provides new developers with the information needed to start working on the project. It includes instructions for installing dependencies and setting up the development environment. For development purposes, it's recommended to use the npm web server to benefit from automatic updates on file saves. Electron should be used to view the website.

## Backend (picpurge.py)

### Usage

The backend script can be executed by calling the `init()` function and providing the required arguments:

```python
init(folder_path, agro_threshold, keep_non_media)
```

- `folder_path` (str): Path to the folder containing images. The script will search through the folder and its subdirectories to find images.
- `agro_threshold` (int): Aggressiveness threshold for duplicate image comparison, ranging from 0 to 5. A higher value signifies a stricter comparison.
- `keep_non_media` (bool): Flag to decide whether to retain or remove non-media files (files with extensions other than supported image and video formats). Set it to `True` to retain non-media files and `False` to remove them.

### Dependencies

The script relies on the following Python libraries:

- `imagehash`: Used for calculating the perceptual hash of images and performing comparisons.
- `PIL` (Python Imaging Library): Required for image processing and opening images.
- `tqdm`: Used for displaying a progress bar during the image comparison process.

Ensure you install these dependencies before running the script using the following command:

```bash
pip install imagehash Pillow tqdm
```

### Supported File Formats

The script supports the following image and video file formats for comparison:

- Image formats: `.jpg`, `.jpeg`, `.png`, `.gif`, `.bmp`
- Video formats: `.mp4`, `.avi`, `.mkv`, `.mov`

### Processing Workflow

The script follows this workflow:

1. Calculate the total number of required comparisons based on the number of images in the specified folder.
2. Create a "Duplicate-Images" folder within the provided path to store duplicate images.
3. Traverse the folder and its subdirectories to gather image file paths.
4. Divide image paths into batches for parallel processing.
5. Process image batches concurrently using multithreading.
6. For each image pair in a batch:
   - Check if file extensions are supported image or video formats. If not, optionally remove non-media files based on the `keep_non_media` flag.
   - Compare images using imagehash and the specified aggressiveness threshold.
   - If images are duplicates, move the second image to the "Duplicate-Images" folder.
7. Update the progress bar to reflect the image comparison progress.
8. Close the progress bar upon completion.

## Backend (picsort.py)


### Image Sorting using InceptionV3 Model

This script utilizes the InceptionV3 model from TensorFlow to automatically sort images based on their predicted labels.

#### Setup

Before running the script, make sure you have the necessary dependencies installed. You can install them using the following command:

```bash
pip install tensorflow
```

### Usage

1. Save the provided script as a `.py` file, e.g., `image_sorting.py`.

2. Open a terminal and navigate to the directory where the script is saved.

3. Run the script by providing the path to the folder containing images to be sorted:

```bash
python image_sorting.py path/to/images
```

Replace `path/to/images` with the actual path to the folder containing the images.

#### Script Overview

1. The script loads the InceptionV3 model pre-trained on the ImageNet dataset.

2. It defines the `predict_and_move` function that takes an image path and an output folder as arguments. This function:

   - Loads and preprocesses the image using the appropriate dimensions.
   - Predicts the label and confidence of the image using the InceptionV3 model.
   - Creates a folder for the predicted category if it doesn't exist.
   - Moves the image to the predicted category folder.

3. The `process_batch` function utilizes multithreading to process a batch of images concurrently.

4. The `main` function:
   - Parses the command-line argument for the input folder.
   - Iterates through the image files in the input folder.
   - Processes images in batches using the `process_batch` function.

##### Notes

- The script will create a `Filtered-Images` folder within the input folder to store the sorted images.

##### Example

Assuming you have a folder named `unsorted_images` containing images to be sorted:

```bash
python image_sorting.py unsorted_images
```

The script will process the images using the InceptionV3 model and move them to respective category folders within the `Filtered-Images` folder.

Remember to install the necessary dependencies before running the script.


## Frontend (Installing React and Electron)

This guide walks you through the installation process for React and Electron, popular frameworks for building cross-platform desktop applications.

### Prerequisites

Before you start, ensure the following prerequisites are installed on your system:

- Node.js (version 12 or higher): Download and install Node.js from the official website: [https://nodejs.org](https://nodejs.org)

- Electron

    1. Install the Electron package by running this command:

        ```terminal
        npm install electron -g
        ```

- radix-ui

    2. Install the radix-ui packages with these commands:

        ```terminal
        npm install @radix-ui/react-switch
        npm install @radix-ui/react-progress
        ```

- vite

    3. Install the vite package:

        ```terminal
        npm install vite
        ```

### Starting The Development Environment

#### Start The WebServer

1. Navigate to the PicPurge/frontend/Picpurge directory.
2. Run:

    ```bash
    npm run dev
    ```

   You can access the webpage from the link provided in the terminal.

#### Start Electron

3. Go to the root directory of the project.
4. Run:

    ```bash
    electron electron/
    ```
````
