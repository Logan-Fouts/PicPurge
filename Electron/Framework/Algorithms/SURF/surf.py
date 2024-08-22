from concurrent.futures import ThreadPoolExecutor
from itertools import combinations

import cv2


class SURF:
    """
    Uses OpenCV to implement SURF, optimized with parallel processing for image comparisons.
    """

    def __init__(
        self,
        threshold=16,
        hessianThreshold=5,
        n_octaves=1,
        n_octave_layers=8,
        extended=True,
        upright=False,
        image_ratio=0.8,
        plot=False,
    ):
        self.name = "SURF"
        self.threshold = threshold
        self.hessianThreshold = hessianThreshold
        self.n_octaves = n_octaves
        self.n_octave_layers = n_octave_layers
        self.extended = extended
        self.upright = upright
        self.image_ratio = image_ratio
        self.plot = plot
        self.max_workers = 4
        self.duplicates = []
        self.possible_duplicates = []

    def process(self, image_paths):
        """
        Process images in parallel to classify duplicates.
        """
        preprocessed_images = self._preprocess_images(image_paths)

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
        surf = cv2.xfeatures2d.SURF_create(
            hessianThreshold=self.hessianThreshold,
            nOctaves=self.n_octaves,
            nOctaveLayers=self.n_octave_layers,
            extended=self.extended,
            upright=self.upright,
        )
        keypoints, descriptors = surf.detectAndCompute(img, None)
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
