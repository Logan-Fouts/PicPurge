# PicPurge
This script compares images in a folder and its subfolders to identify and allopw for easy removal of duplicates.

## Prerequisites:
- Python 3.x
- Required Python packages: `Pillow`, `tqdm`, `imagehash`

## Installation:
1. Clone the repository:
   ```shell
   git clone https://github.com/yourusername/duplicate-image-remover.git
1. Install the required Python packages:
   ```shell
   pip install Pillow tqdm imagehash
## Usage:
1. Navigate to the cloned repository directory:  
   ```shell
   cd duplicate-image-remover
1. Run the script with the desired folder path:
   ```shell
   python duplicate_image_remover.py --agro 0 /path/to/folder
* **Note-** Replace "/path/to/folder" with the actual path to the folder containing the images. 
* **Note-** Set the aggresivness of the removal 0 is not agressive and 10 is very aggresive.
3. The script will compare the images and move the duplicate images to a separate folder named "Duplicate-Images" within the original folder.

## Supported File Types:
* Image Extensions: .jpg, .jpeg, .png, .gif, .bmp
* Video Extensions: .mp4, .avi, .mkv, .mov
  

---
## License:
MIT License (Modified for Non-Commercial Use)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), limited
to non-commercial use, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

Non-commercial use means using the software solely for personal or internal
non-commercial purposes. Commercial use of the software, including without
limitation, selling or offering to sell copies of the software, incorporating
the software into commercial products, or using the software in any way to
generate revenue, is prohibited.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
