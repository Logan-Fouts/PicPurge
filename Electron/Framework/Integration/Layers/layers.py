import os
import random
import shutil
import time
import sys

from pathlib import Path
from Wrapper.wrapper import Wrapper


class UnionFind:
    """
    A simple Union-Find class to manage a collection of disjoint sets.
    """

    def __init__(self):
        """
        Initializes the Union-Find structure.
        """
        self.parent = {}

    def find(self, item):
        """
        Finds and returns the root of the set containing the item.
        """
        if self.parent[item] != item:
            self.parent[item] = self.find(self.parent[item])
        return self.parent[item]

    def union(self, item1, item2):
        """
        Merges the sets that have item1 and item2.
        """
        root1 = self.find(item1)
        root2 = self.find(item2)
        if root1 != root2:
            self.parent[root2] = root1

    def add(self, item):
        """
        Adds an item.
        """
        if item not in self.parent:
            self.parent[item] = item


class Layers:
    """
    Builds and allows for execution of the layered architecture.
    """

    def __init__(self, raw_layers, debug=False):
        self.layers = []
        self._wrap_layers(raw_layers)
        self.debug = debug
        self.result_duplicates = []
        self.result_possible_duplicates = []

    def _wrap_layers(self, raw_layers):
        """
        Wraps each given layer with a compatibility layer.
        """
        for layer in raw_layers:
            self.layers.append(Wrapper(layer))

    def run(self, image_paths):
        """
        Executes the classes given in sequence.
        """
        progress_percentage = 0
        increment_amount = 100 / len(self.layers)
        curr_paths = set(image_paths)

        for layer in self.layers:
            if len(curr_paths) < 1:
                continue

            layer.run(curr_paths)
            tmp_dups, _ = layer.get_results()

            curr_paths = self._setup_further_processing(tmp_dups, curr_paths)

            if self.debug:
                layer.print_results()

            progress_percentage += increment_amount
            print(f"Progress: {progress_percentage:.2f}%")
            sys.stdout.flush()

        lst = [item for tup in self.result_duplicates for item in tup]
        self.result_possible_duplicates = list(set(curr_paths) - set(lst))

    def _setup_further_processing(self, duplicates, image_paths):
        """
        Clean up curr_paths and result_duplicates for further processing.
        """
        for duplicate_group in duplicates:
            if duplicate_group not in self.result_duplicates:
                self.result_duplicates.append(duplicate_group)

        lst = [item for tup in self.result_duplicates for item in tup]
        curr_paths = set(image_paths) - set(lst)

        for _ in range(len(duplicates)):
            print("Duplicate_Found_Message")
            time.sleep(0.01)

        self.result_duplicates = self.group_related_images(self.result_duplicates)

        for group in self.result_duplicates:
            if group:
                rand_img = random.choice(group)
                curr_paths.add(rand_img)

        return curr_paths

    def group_related_images(self, tuples):
        """
        Group all related duplicate image pairs into clusters.
        """
        uf = UnionFind()
        for group in tuples:
            if isinstance(group, (list, tuple)):
                for i in range(len(group) - 1):
                    for j in range(i + 1, len(group)):
                        uf.add(group[i])
                        uf.add(group[j])
                        uf.union(group[i], group[j])
            else:
                uf.add(group)
                uf.union(group, group)

        groups = {}
        for image in uf.parent:
            root = uf.find(image)
            if root not in groups:
                groups[root] = []
            groups[root].append(image)
        return list(groups.values())

    def calculate_metrics(self, tp, fp, tn, fn):
        """
        Calculate precision, recall, F1-score, and accuracy
        """
        precision = tp / (tp + fp) if tp + fp > 0 else 0
        recall = tp / (tp + fn) if tp + fn > 0 else 0
        f1_score = (
            2 * (precision * recall) / (precision + recall)
            if precision + recall > 0
            else 0
        )
        accuracy = (tp + tn) / (tp + fp + tn + fn) if tp + fp + tn + fn > 0 else 0

        return precision, recall, f1_score, accuracy

    def print_final_results(self, move=True):
        """
        Writes the final results to a file, formatting the output.
        """
        lst = [item for sub_lst in self.result_duplicates for item in sub_lst]

        print(
            "Final length of all results:",
            len(lst) + len(self.result_possible_duplicates),
        )

        self._write(move)

    def _write(self, move):
        if not self.result_duplicates:
            return
        # Get the path to the desktop
        desktop_path = Path.home() / "Desktop"
        base_dir = desktop_path / "classified_images"
        base_dir.mkdir(exist_ok=True)
        # Handle duplicates
        dups_dir = base_dir / "duplicates_directory"
        dups_dir.mkdir(exist_ok=True)
        related_groups = self.group_related_images(self.result_duplicates)
        for i, group in enumerate(related_groups, 1):
            group_dir = dups_dir / f"group_{i}"
            group_dir.mkdir(exist_ok=True)
            for img_path in group:
                if Path(img_path).exists():
                    if move:
                        shutil.move(img_path, group_dir)
                    else:
                        shutil.copy(img_path, group_dir)
        # Handle non-duplicates
        non_dups_dir = base_dir / "non_duplicates_directory"
        non_dups_dir.mkdir(exist_ok=True)
        for img_path in self.result_possible_duplicates:
            if Path(img_path).exists():
                if move:
                    shutil.move(img_path, non_dups_dir)
                else:
                    shutil.copy(img_path, non_dups_dir)
        # Write results to a text file on the desktop
        results_file = desktop_path / "duplicate_image_results.txt"
        with results_file.open('w') as f:
            f.write("Duplicate Images:\n")
            for group in self.result_duplicates:
                f.write(f"Group: {', '.join(group)}\n")
            f.write("\nPossible Duplicates:\n")
            for img in self.result_possible_duplicates:
                f.write(f"{img}\n")
