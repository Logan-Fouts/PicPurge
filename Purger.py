import os
import argparse
import shutil
import matplotlib.pyplot as plt
from PIL import Image
from tqdm import tqdm
import concurrent.futures

def compare_images(image_path1, image_path2, target_size=(32, 32)):
    try:
        image1 = Image.open(image_path1)
        image2 = Image.open(image_path2)

        image1 = image1.resize(target_size)
        image2 = image2.resize(target_size)

        pixel_pairs = zip(image1.getdata(), image2.getdata())
        if any(p1 != p2 for p1, p2 in pixel_pairs):
            return False

        return True
    except (IOError, OSError, ValueError) as e:
        return False

def process_image_pair(image1_path, image2_path, output_folder, no_approval):
    _, file_extension = os.path.splitext(image1_path)
    if file_extension.lower() not in image_extensions + video_extensions:
        try:
            # Remove non-image or non-video files
            os.remove(image1_path)
        except FileNotFoundError:
            pass
        return

    _, file_extension = os.path.splitext(image2_path)
    if file_extension.lower() not in image_extensions + video_extensions:
        try:
            # Remove non-image or non-video files
            os.remove(image2_path)
        except FileNotFoundError:
            pass
        return

    # Skip if image1_path does not exist
    if not os.path.exists(image1_path):
        return

    # Skip if image2_path does not exist
    if not os.path.exists(image2_path):
        return

    shutil.copy(image1_path, os.path.join(output_folder, os.path.basename(image1_path)))

    if compare_images(image1_path, image2_path):
        print(f"{os.path.basename(image1_path)} and {os.path.basename(image2_path)} are the same.")

        if not no_approval:
            fig, axs = plt.subplots(1, 2)
            axs[0].imshow(Image.open(image1_path))
            axs[0].set_title(os.path.basename(image1_path))
            axs[0].axis("off")
            axs[1].imshow(Image.open(image2_path))
            axs[1].set_title(os.path.basename(image2_path))
            axs[1].axis("off")
            plt.subplots_adjust(wspace=4)

            plt.show()

        # Remove the images without approval if no_approval is set
        if no_approval:
            try:
                os.remove(image2_path)
                print(f"{os.path.basename(image2_path)} has been removed and moved to {output_folder}.")
            except FileNotFoundError:
                pass
        else:
            # Ask for confirmation to remove the images
            answer = input("Do you want to remove the second copy? (y/n): ")
            if answer.lower() == 'y':
                try:
                    os.remove(image2_path)
                    print(f"{os.path.basename(image2_path)} has been removed.")
                except FileNotFoundError:
                    pass
            else:
                print(f"{os.path.basename(image2_path)} has not been removed.")
    else:
        shutil.copy(image2_path, os.path.join(output_folder, os.path.basename(image2_path)))

    pbar.update(1)

parser = argparse.ArgumentParser(description='Compare and remove duplicate images.')
parser.add_argument('folder', type=str, help='Path to the folder containing the images.')
parser.add_argument('--no-approval', action='store_true', help='Remove duplicates without approval')

args = parser.parse_args()
folder_path = args.folder
no_approval = args.no_approval

# Get a list of supported image and video file extensions
image_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp']
video_extensions = ['.mp4', '.avi', '.mkv', '.mov']

# Compare images in the folder and its subfolders recursively
total_files = sum(len(files) for _, _, files in os.walk(folder_path))
processed_files = 0

# Initialize progress bar
pbar = tqdm(total=total_files, desc='Progress', unit='file')

# Create a separate folder for moving images
output_folder = os.path.join(folder_path, 'Processed-Media')
os.makedirs(output_folder, exist_ok=True)

# Collect image pairs to process
image_pairs = []
for root, dirs, files in os.walk(folder_path):
    for i in range(len(files) - 1):
        image1_path = os.path.join(root, files[i])
        image2_path = os.path.join(root, files[i+1])
        image_pairs.append((image1_path, image2_path))

# Process image pairs using multithreading
with concurrent.futures.ThreadPoolExecutor() as executor:
    futures = []
    for image_pair in image_pairs:
        futures.append(executor.submit(process_image_pair, *image_pair, output_folder, no_approval))

    for future in concurrent.futures.as_completed(futures):
        future.result()

pbar.close()
