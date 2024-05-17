import imagehash
from PIL import Image


class Dhash:
    def __init__(self, threshold=0.95, sim=True):
        self.name = "Dhash"
        self.threshold = threshold
        self.duplicates = []
        self.possible_duplicates = []
        self.sim = sim

    def process(self, image_paths):
        """
        Takes provided image paths and classifies them as duplicates, not duplicates, or unsure.
        """
        image_paths = set(image_paths)

        hashes = {image_path: self._dhash(image_path) for image_path in image_paths}
        checked_pairs = set()

        for path1, hash1 in hashes.items():
            for path2, hash2 in hashes.items():
                if (
                    path1 == path2
                    or (path1, path2) in checked_pairs
                    or (path2, path1) in checked_pairs
                ):
                    continue

                result = self._filter(hash1, hash2)

                if result == 0:
                    self.duplicates.append((path1, path2))
                elif result == 1:
                    self.possible_duplicates.append(path1)
                    self.possible_duplicates.append(path2)

                checked_pairs.add((path1, path2))
                checked_pairs.add((path2, path1))

    def _dhash(self, image_path):
        try:
            with Image.open(image_path) as image:
                image = image.convert("L").resize((9, 8), Image.LANCZOS)
                return imagehash.dhash(image)
        except IOError as e:
            print(f"Error accessing image: {image_path}: {e}")
            return None

    def _filter(self, h1, h2):
        """
        Uses hamming distance or similarity to classify images.
        0 = duplicates, 1 = possible duplicates
        """
        if h1 and h2:
            hamming_distance = h1 - h2
        else:
            return

        if self.sim:
            hash_squared = len(h1)
            similarity = (hash_squared - hamming_distance) / hash_squared
            if similarity > self.threshold:
                return 0
            return 1

        if hamming_distance > self.threshold:
            return 0
        return 1
