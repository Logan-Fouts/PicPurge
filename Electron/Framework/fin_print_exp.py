import os
import sys
import time
from collections import Counter, defaultdict

# Make python see the modules by adding paths to the path
project_root = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.join(project_root, "Algorithms"))
sys.path.append(os.path.join(project_root, "Integration"))

# Import modules
from Dhash.dhash import Dhash
from Layers.layers import Layers
from Phash.phash import Phash
from SIFT.sift import SIFT


def get_image_paths(directory):
    """
    Recursively grabs image paths from directory and stores in an array.
    """
    extensions = {".jpg", ".jpeg", ".png", ".bmp"}
    paths = [
        os.path.join(root, file)
        for root, _, files in os.walk(directory)
        for file in files
        if os.path.splitext(file)[1].lower() in extensions
    ]
    paths.sort()
    return paths


def group_images(paths):
    """
    Groups image paths based on the file names since the data set is a little weird.
    """
    grouped_paths = defaultdict(list)
    for path in paths:
        group_key = "_".join(os.path.basename(path).split("_")[:5])
        grouped_paths[group_key].append(path)
    return grouped_paths


def finger_accuracy_calculator(duplicate_groups, non_duplicate_list, lonely_imgs):
    """
    Method to calculate the accuracy of duplicate detection.
    """
    true_pos = 0
    false_pos = 0
    true_neg = 0

    if lonely_imgs:
        for img in non_duplicate_list:
            if img in lonely_imgs:
                true_neg += 1

    false_neg = len(non_duplicate_list) - true_neg

    for dup_group in duplicate_groups:
        relevant_parts = [item.split("/")[-1].split("_")[0:5] for item in dup_group]
        relevant_parts_combined = ["_".join(parts) for parts in relevant_parts]
        most_common_segment, _ = Counter(relevant_parts_combined).most_common(1)[0]

        for path in dup_group:
            relevant_part = "_".join(path.split("/")[-1].split("_")[:5])
            match = most_common_segment == relevant_part

            if match:
                true_pos += 1
            else:
                false_pos += 1

    return true_pos, false_pos, true_neg, false_neg


def run_experiment(size, path):
    """
    Sets up the layers and params then runs the architecture with size and path.
    """
    # Config for Finger Prints Dataset
    image_paths = get_image_paths(path)
    groups = group_images(image_paths[:size])

    lonely_imgs = set()
    for _, group in groups.items():
        if len(group) == 1:
            lonely_imgs.add(group[0])
            print(f"Lonely boy: {group[0]}")

    test_paths = [path for group in groups.values() for path in group]

    print(f"Number of groups: {len(groups)}")

    layers = [
        Phash(threshold=4),
        Dhash(threshold=0.95, sim=True),
        SIFT(
            threshold=13,
            sigma=1.2,
            edge_threshold=1000**10,
            n_octave_layers=8,
            contrast_threshold=0.01,
            image_ratio=0.3,
        ),
    ]

    layered_architecture = Layers(
        raw_layers=layers, accuracy_calculator=finger_accuracy_calculator
    )

    # Measure execution time
    start_time = time.perf_counter()
    layered_architecture.run(test_paths)
    end_time = time.perf_counter()
    elapsed_time = end_time - start_time

    layered_architecture.print_final_results(
        elapsed_time=elapsed_time, lonely_imgs=lonely_imgs, move=False
    )
    print(f"Elapsed time: {elapsed_time:.4f} seconds")


for i in range(300, 3300, 300):
    run_experiment(i, "Images/Finger_Prints/Altered/Altered-Easy")
