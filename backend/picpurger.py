import argparse
import concurrent.futures
import itertools
import math
import os
import shutil
import threading

import imagehash
from PIL import Image
from tqdm import tqdm

# Define supported image and video file extensions
image_extensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp"]
video_extensions = [".mp4", ".avi", ".mkv", ".mov"]

lock = threading.Lock()


# Function to compare images using imagehash
def compare_images(image1_path, image2_path, agro, pbar):
    try:
        hash1 = imagehash.dhash(Image.open(image1_path))
        hash2 = imagehash.dhash(Image.open(image2_path))
        hamming_distance = hash1 - hash2
        result = hamming_distance <= agro
        with lock:
            pbar.update(1)  # Update progress bar in a thread-safe manner
        return result
    except (IOError, OSError, ValueError) as e:
        return False


def process_image_batch(image_paths, output_folder, agro, keep_non_media, pbar):
    for i in range(len(image_paths)):
        for j in range(i + 1, len(image_paths)):
            image1_path = image_paths[i]
            image2_path = image_paths[j]
            process_image_pair(
                image1_path, image2_path, output_folder, agro, keep_non_media, pbar
            )


def process_image_pair(
    image1_path, image2_path, output_folder, agro, keep_non_media, pbar
):
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

    if compare_images(image1_path, image2_path, agro, pbar):
        try:
            shutil.move(
                image2_path, os.path.join(output_folder, os.path.basename(image2_path))
            )
        except FileNotFoundError:
            pass


#################################### Init ####################################
def init(folder_path, agro_threshold, keep_non_media):
    # Collect image paths
    image_paths = []
    for root, dirs, files in os.walk(folder_path):
        # Ignore the folder named "Duplicate-Images"
        if "Duplicate-Images" in dirs:
            dirs.remove("Duplicate-Images")

        image_paths.extend([os.path.join(root, file) for file in files])


    # Calculate the total number of comparisons needed
    total_comparisons = (len(image_paths) * (len(image_paths) - 1)) // 2

    # Initialize progress bar and lock for thread-safe updates
    pbar = tqdm(total=total_comparisons, desc="Progress", unit="comparisons")

    # Create a separate folder for moving duplicate images
    output_folder = os.path.join(folder_path, "Duplicate-Images")
    os.makedirs(output_folder, exist_ok=True)

    batch_size = 500  # Number of images to process in each batch

    # Split image paths into batches
    image_batches = [
        image_paths[i : i + batch_size] for i in range(0, len(image_paths), batch_size)
    ]

    #################################### Processing ####################################
    # Process image batches using multithreading
    with concurrent.futures.ThreadPoolExecutor() as executor:
        futures = []
        for image_batch in image_batches:
            futures.append(
                executor.submit(
                    process_image_batch,
                    image_batch,
                    output_folder,
                    agro_threshold,
                    keep_non_media,
                    pbar,
                )
            )

        for future in concurrent.futures.as_completed(futures):
            future.result()

    pbar.close()

    # Return the tqdm progress bar object
    return pbar


# Function to get the progress percentage from the tqdm progress bar
def get_progress_update(pbar):
    if pbar is not None:
        progress_percentage = (pbar.n / pbar.total) * 100
        return progress_percentage
    else:
        return 0  # Return 0 if pbar is not initialized
