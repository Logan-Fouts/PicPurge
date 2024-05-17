import concurrent.futures

from skimage import img_as_float, io
from skimage.metrics import structural_similarity as ssim
from skimage.transform import resize


class SSIM:
    def __init__(self, threshold=0.85):
        self.name = "SSIM"
        self.threshold = threshold
        self.duplicates = []
        self.possible_duplicates = []

    def process(self, image_paths):
        """
        Uses ssim to classify images as duplicates or not.
        """
        image_paths = list(image_paths)
        images = []
        for path in image_paths:
            img = img_as_float(io.imread(path, as_gray=True))
            if img is not None:
                new_shape = (int(img.shape[0] * 0.65), int(img.shape[1] * 0.65))
                img = resize(img, new_shape, anti_aliasing=True)
                images.append(img)

        with concurrent.futures.ThreadPoolExecutor() as executor:
            futures = []
            num_images = len(images)
            for i in range(num_images):
                for j in range(i + 1, num_images):
                    futures.append(
                        executor.submit(
                            self._calculate_ssim,
                            images[i],
                            images[j],
                            image_paths[i],
                            image_paths[j],
                        )
                    )

            for future in concurrent.futures.as_completed(futures):
                result, img1_path, img2_path = future.result()
                if result > self.threshold:
                    self.duplicates.append((img1_path, img2_path))
                else:
                    self.possible_duplicates.extend((img1_path, img2_path))

    def _calculate_ssim(self, img1, img2, img1_path, img2_path):
        """
        Performs ssim using skimage library and retrns results.
        """
        ssim_index = ssim(img1, img2, data_range=1)
        return ssim_index, img1_path, img2_path
