import argparse
import math
import sys
import os
import glob
from PIL import Image
import imagehash
import shutil
from multiprocessing import Pool, Manager

def find_image_files(image_dir, image_extensions):
    image_files = []

    for root, _, files in os.walk(image_dir):
        if duplicate_folder in root:
            continue
        for file in files:
            if file.lower().endswith(tuple(image_extensions)):
                image_files.append(os.path.join(root, file))

    return image_files

def compute_image_hash(image_file):
    try:
        img = Image.open(image_file)
        img_hash = str(imagehash.dhash(img))
        return image_file, img_hash
    except Exception as e:
        print(f"An error occurred for {image_file}: {e}")
        return None

def compute_image_hashes(image_dir, duplicate_folder, agro_threshold, batch_size=float(math.inf), progress=None):
    image_files = find_image_files(image_dir, image_extensions)

    hashes = {}
    batch_hashes = []

    total_images = len(image_files)

    with Pool(num_workers) as pool:
        try:
            for result in pool.imap(compute_image_hash, image_files):
                if result:
                    image_file, img_hash = result
                    batch_hashes.append((image_file, img_hash))
                    progress.value += 1  # Update progress

                    if len(batch_hashes) >= batch_size:
                        compare_hashes(batch_hashes, hashes, duplicate_folder, image_files, agro_threshold)
                        batch_hashes = []

            compare_hashes(batch_hashes, hashes, duplicate_folder, image_files, agro_threshold)
        except Exception as e:
            print(f"An error occurred: {e}")

    return hashes


def hamming_distance(hash1, hash2):
    return bin(int(hash1, 16) ^ int(hash2, 16)).count('1')

def compare_hashes(batch_hashes, all_hashes, duplicate_folder, image_files, agro_threshold):
    total_images = len(image_files)
    processed_images = len(all_hashes)
    progress_percentage = ((processed_images / total_images) * 100) + 50

    sys.stdout.flush()
    print(f"Progress: {progress_percentage:.2f}%")

    for i, (file, hash_val) in enumerate(batch_hashes, start=1):
        duplicates = []
        for existing_file, existing_hash in all_hashes.items():
            if hamming_distance(hash_val, existing_hash) <= agro_threshold:
                duplicates.append(existing_file)
        all_hashes[file] = hash_val
        if duplicates:
            move_duplicates(file, duplicates, duplicate_folder, image_files)

        progress_percentage = (((processed_images + i) / total_images) * 100) + 50
        sys.stdout.flush()
        print(f"Progress: {progress_percentage:.2f}%")

def move_duplicates(file, duplicates, duplicate_folder, image_files):
    if not os.path.exists(duplicate_folder):
        os.makedirs(duplicate_folder)

    for duplicate_file in duplicates:
        if os.path.exists(duplicate_file):
            try:
                shutil.move(duplicate_file, os.path.join(duplicate_folder, os.path.basename(duplicate_file)))

                sys.stdout.flush()
                print("Duplicate_Found_Message")  # Print the message immediately
                
                if duplicate_file in image_files:
                    image_files.remove(duplicate_file)
            except Exception as e:
                print(f"An error occurred while moving {duplicate_file}: {e}")

image_extensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp"]
num_workers = 20

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Find and remove duplicate images.")
    parser.add_argument("folder_path", type=str, help="Path to the folder containing images.")
    parser.add_argument("agro_threshold", type=int, help="Hamming distance threshold for image similarity.")
    parser.add_argument("--keep_non_media", action="store_true", help="Keep non-media files.")
    args = parser.parse_args()

    duplicate_folder = args.folder_path + "/Duplicate Images"

    with Manager() as manager:
        progress = manager.Value("i", 0)
        hashes = compute_image_hashes(args.folder_path, duplicate_folder, args.agro_threshold, progress=progress)