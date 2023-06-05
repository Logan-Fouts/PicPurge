import os
import argparse
import shutil
from PIL import Image
from tqdm import tqdm
import concurrent.futures
import imagehash
import itertools
import threading
import math

# Function to compare images using imagehash
def compare_images(image_path1, image_path2, agro):
    try:
        hash1 = imagehash.dhash(Image.open(image_path1))
        hash2 = imagehash.dhash(Image.open(image_path2))
        hamming_distance = hash1 - hash2
        result = hamming_distance <= agro
        with lock:
            pbar.update(1)  # Update progress bar in a thread-safe manner
        return result
    except (IOError, OSError, ValueError) as e:
        return False

def process_image_pair(image1_path, image2_path, output_folder, agro, keep_non_media):
    _, file_extension = os.path.splitext(image1_path)

    if image1_path == image2_path:
        return
    
    if file_extension.lower() not in image_extensions + video_extensions:
        if not keep_non_media:
            try:
                os.remove(image1_path)
            except FileNotFoundError:
                pass
        return

    _, file_extension = os.path.splitext(image2_path)
    if file_extension.lower() not in image_extensions + video_extensions:
        if not keep_non_media:
            try:
                os.remove(image2_path)
            except FileNotFoundError:
                pass
        return

    if not os.path.exists(image1_path) or not os.path.exists(image2_path):
        return

    if compare_images(image1_path, image2_path, agro):
        try:
            shutil.move(image2_path, os.path.join(output_folder, os.path.basename(image2_path)))
        except FileNotFoundError:
            pass

#################################### Init ####################################
# Parse command-line arguments
parser = argparse.ArgumentParser(description='Compare and remove duplicate images.')
parser.add_argument('folder', type=str, help='Path to the folder containing the images. (Traversal included)')
parser.add_argument('--agro', type=int, default=5, help='Aggressiveness threshold for duplicate image comparison')
parser.add_argument('--no-clean', action='store_true', help='Keep non-image/non-video files')
args = parser.parse_args()
folder_path = args.folder
agro_threshold = args.agro
keep_non_media = args.no_clean

# Define supported image and video file extensions
image_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp']
video_extensions = ['.mp4', '.avi', '.mkv', '.mov']

# Calculate the total number of comparisons needed
image_count = sum(len(files) for _, _, files in os.walk(folder_path))
total_comparisons = (image_count * (image_count - 1)) // 2

# Initialize progress bar and lock for thread-safe updates
pbar = tqdm(total=total_comparisons, desc='Progress', unit='comparison')
lock = threading.Lock()

# Create a separate folder for moving duplicate images
output_folder = os.path.join(folder_path, 'Duplicate-Images')
os.makedirs(output_folder, exist_ok=True)

# Collect image paths
image_paths = []
for root, dirs, files in os.walk(folder_path):
    image_paths.extend([os.path.join(root, file) for file in files])

image_pairs = list(itertools.combinations(range(len(image_paths)), 2))

#################################### Processing ####################################
# Process image pairs using multithreading
with concurrent.futures.ThreadPoolExecutor() as executor:
    futures = []
    for image_pair in image_pairs:
        image1_path = image_paths[image_pair[0]]
        image2_path = image_paths[image_pair[1]]
        futures.append(executor.submit(process_image_pair, image1_path, image2_path, output_folder, agro_threshold, keep_non_media))

    for future in concurrent.futures.as_completed(futures):
        future.result()

pbar.close()
