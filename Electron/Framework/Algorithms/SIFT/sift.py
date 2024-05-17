from concurrent.futures import ThreadPoolExecutor
from itertools import combinations

import cv2


class SIFT:
    """
    Uses OpenCV to implement SIFT, optimized with parallel processing for image comparisons.
    """

    def __init__(
        self,
        threshold=30,
        sigma=1.6,
        edge_threshold=10,
        n_octave_layers=3,
        contrast_threshold=0.04,
        image_ratio=0.3,
        showprogress=False, # in the perumtation its hard to set this
    ):
        self.name = "SIFT"
        self.threshold = threshold
        self.image_ratio = image_ratio
        self.sigma = sigma
        self.edge_threshold = edge_threshold
        self.n_octave_layers = n_octave_layers
        self.contrast_threshold = contrast_threshold
        self.max_workers = 4
        self.duplicates = []
        self.possible_duplicates = []
        self.showprogress = showprogress

    def process(self, image_paths):
        """
        Process images in parallel to classify duplicates.
        """
        preprocessed_images = self._preprocess_images(image_paths)
        total_pairs = len(image_paths) * (len(image_paths) - 1) / 2
        processed_pairs = 0

        pairs = list(combinations(preprocessed_images.keys(), 2))
        with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            future_to_pair = {
                executor.submit(self._process_pair, pair, preprocessed_images): pair
                for pair in pairs
            }
            for future in future_to_pair:
                result = future.result()
                if result is not None:
                    result_type, path1, path2 = result
                    if result_type == 0:
                        self.duplicates.append((path1, path2))
                    elif result_type == 1:
                        self.possible_duplicates.extend((path1, path2))
                    processed_pairs += 1
                    p = (processed_pairs / total_pairs) * 100

                    if self.showprogress == True:
                        print(f"Processed {p}%...")

    def _process_pair(self, pair, preprocessed_images):
        path1, path2 = pair
        _, _, descriptors1 = preprocessed_images[path1]
        _, _, descriptors2 = preprocessed_images[path2]

        if descriptors1 is None or descriptors2 is None:
            return None

        matches = cv2.BFMatcher().knnMatch(descriptors1, descriptors2, k=2)
        close_enough_matches = self._calc_lowe(matches)

        result = self._filter(close_enough_matches)
        return result, path1, path2

    def _preprocess_images(self, image_paths):
        with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            results = list(executor.map(self._preprocess_single_image, image_paths))
        return dict(zip(image_paths, results))

    def _preprocess_single_image(self, image_path):
        img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
        if img is None:
            print(f"Failed to open image: {image_path}.")
            return None, None, None
        img = cv2.equalizeHist(img)
        img = cv2.resize(
            img,
            None,
            fx=self.image_ratio,
            fy=self.image_ratio,
            interpolation=cv2.INTER_AREA,
        )
        sift = cv2.SIFT_create(
            # nOctaveLayers=self.n_octave_layers,
            contrastThreshold=self.contrast_threshold,
            edgeThreshold=self.edge_threshold,
            sigma=self.sigma,
        )
        keypoints, descriptors = sift.detectAndCompute(img, None)
        return img, keypoints, descriptors

    def _calc_lowe(self, matches):
        close_enough_matches = []
        for match_pair in matches:
            if len(match_pair) >= 2:
                m, n = match_pair
                if m.distance < 0.7 * n.distance:
                    close_enough_matches.append(m)
        return close_enough_matches

    def _filter(self, matches):
        if len(matches) > self.threshold:
            return 0
        return 1
