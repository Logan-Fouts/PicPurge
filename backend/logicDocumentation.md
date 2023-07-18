## Image Purge Documentation

The Image Purge is a Python script that allows you to compare and remove duplicate images in a specified folder. It utilizes the `imagehash` library to calculate the perceptual hash of images and compares them to determine duplicates based on a specified aggressiveness threshold.

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
