import argparse
import concurrent.futures
import os
import shutil
import threading
import PIL
from flask import Flask
from tqdm import tqdm
import imagehash

class ImageProcessor:
    def __init__(self):
        self.num_images = -1
        self.lock = threading.Lock()
        self.pbar = None
        self.batch_size = 500

    def compare_images(self, image1_path, image2_path, agro, pbar):
        try:
            hash1 = imagehash.dhash(PIL.Image.open(image1_path))
            hash2 = imagehash.dhash(PIL.Image.open(image2_path))
            hamming_distance = hash1 - hash2
            result = hamming_distance <= agro
            with self.lock:
                if result:
                    self.num_images -= 1
                    pbar.update(self.num_images)
                else:
                    pbar.update(1)
            return result
        except (FileNotFoundError, PIL.UnidentifiedImageError) as e:
            return False

    def process_image_batch(self, image_paths, output_folder, agro, keep_non_media, pbar):
        for i in range(len(image_paths)):
            for j in range(i + 1, len(image_paths)):
                image1_path = image_paths[i]
                image2_path = image_paths[j]
                self.process_image_pair(
                    image1_path, image2_path, output_folder, agro, keep_non_media, pbar
                )

    def process_image_pair(
        self, image1_path, image2_path, output_folder, agro, keep_non_media, pbar
    ):
        _, file_extension = os.path.splitext(image1_path)

        if image1_path == image2_path:
            return

        if file_extension.lower() not in IMAGE_EXTENSIONS + VIDEO_EXTENSIONS:
            if not keep_non_media:
                try:
                    os.remove(image1_path)
                except FileNotFoundError:
                    pass
            return

        _, file_extension = os.path.splitext(image2_path)
        if file_extension.lower() not in IMAGE_EXTENSIONS + VIDEO_EXTENSIONS:
            if not keep_non_media:
                try:
                    os.remove(image2_path)
                except FileNotFoundError:
                    pass
            return

        if not os.path.exists(image1_path) or not os.path.exists(image2_path):
            return

        if self.compare_images(image1_path, image2_path, agro, pbar):
            try:
                shutil.move(
                    image2_path, os.path.join(output_folder, os.path.basename(image2_path))
                )
            except FileNotFoundError:
                pass

    def init(self, folder_path, agro_threshold, keep_non_media):
        self.image_paths = []
        for root, dirs, files in os.walk(folder_path):
            if "Duplicate-Images" in dirs:
                dirs.remove("Duplicate-Images")

            self.image_paths.extend([os.path.join(root, file) for file in files])

        self.num_images = len(self.image_paths)
        total_comparisons = (len(self.image_paths) * (len(self.image_paths) - 1)) // 2
        self.pbar = tqdm(total=total_comparisons, desc="Progress", unit="comparisons")

        output_folder = os.path.join(folder_path, "Duplicate-Images")
        os.makedirs(output_folder, exist_ok=True)

        image_batches = [
            self.image_paths[i : i + self.batch_size] for i in range(0, len(self.image_paths), self.batch_size)
        ]

        # Begin Processing
        with concurrent.futures.ThreadPoolExecutor() as executor:
            futures = []
            for image_batch in image_batches:
                futures.append(
                    executor.submit(
                        self.process_image_batch,
                        image_batch,
                        output_folder,
                        agro_threshold,
                        keep_non_media,
                        self.pbar,
                    )
                )

            for future in concurrent.futures.as_completed(futures):
                future.result()

        self.pbar.close()
        return self.pbar

    def get_progress_update(self):
        if self.pbar is not None and self.pbar.total != 0:
            progress_percentage = (self.pbar.n / self.pbar.total) * 100
            return progress_percentage
        else:
            return 0

app = Flask(__name__)

IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".bmp"]
VIDEO_EXTENSIONS = [".mp4", ".avi", ".mkv", ".mov"]

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Find and remove duplicate images.")
    parser.add_argument("folder_path", type=str, help="Path to the folder containing images.")
    parser.add_argument("agro_threshold", type=int, help="Hamming distance threshold for image similarity.")
    parser.add_argument("--keep_non_media", action="store_true", help="Keep non-media files.")
    args = parser.parse_args()

    processor = ImageProcessor()
    processor.init(args.folder_path, args.agro_threshold, args.keep_non_media)