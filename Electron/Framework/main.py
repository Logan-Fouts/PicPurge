import argparse
import os
import sys

project_root = os.path.dirname(os.path.abspath(__file__))
algorithms_path = os.path.join(project_root, "Algorithms")
integration_path = os.path.join(project_root, "Integration")

sys.path.append(algorithms_path)
sys.path.append(integration_path)

from Dhash.dhash import Dhash
from Layers.layers import Layers
from Phash.phash import Phash
from SIFT.sift import SIFT
from VGG.vgg import VGG


def get_image_paths(directory):
    """
    Recursively grabs image paths from directory and stores in an array.
    """
    paths = []
    extensions = {".jpg", ".jpeg", ".png"}

    for root, _, files in os.walk(directory):
        for file in files:
            if os.path.splitext(file)[1].lower() in extensions:
                paths.append(os.path.join(root, file))

    return paths


def main(image_dir, preset):
    """
    Takes args and runs specified layered architecture.
    """
    image_paths = get_image_paths(image_dir)
    layers = []

    match preset:
        case 1:
            layers = [
                Dhash(sim=True, threshold=0.9),
                Phash(threshold=11),
                VGG(threshold=0.7),
                SIFT(
                    threshold=16,
                    sigma=1.6,
                    edge_threshold=10,
                    n_octave_layers=3,
                    contrast_threshold=0.04,
                    image_ratio=0.1,
                ),
            ]  # Personal Photo Library
        case 2:
            layers = [
                Phash(threshold=4),
                Dhash(sim=True, threshold=0.95),
                SIFT(
                    threshold=13,
                    sigma=1.2,
                    edge_threshold=1000**10,
                    n_octave_layers=8,
                    contrast_threshold=0.01,
                ),
            ]  # Fingerprinting
        case 3:
            print("TODO")
        case 4:
            print("TODO")
        case 5:
            print("TODO")
        case 6:
            print("TODO")
        case 7:
            print("TODO")
        case 8:
            print("TODO")


    if layers:
        layered_architecture = Layers(layers)
        layered_architecture.run(image_paths)
        layered_architecture.print_final_results(move=False)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Find duplicate images.")
    parser.add_argument(
        "folder_path", type=str, help="Path to the folder containing images."
    )
    parser.add_argument("preset", type=int, help="Include preset index.")
    args = parser.parse_args()
    main(args.folder_path, args.preset)
